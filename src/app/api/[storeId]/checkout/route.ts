import { NextResponse } from "next/server";

import Stripe from "stripe";

import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeader });
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findFirst({
      where: { id: params.storeId },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const { productIds } = await request.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const productsPromises = productIds.map((productId: string) => {
      return prisma.product.findMany({
        where: {
          id: productId,
        },
      });
    });
    const productsArray = await Promise.all(productsPromises);
    const products = productsArray.flat();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price.toNumber() * 100),
        },
      });
    });

    const order = await prisma.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        OrderItem: {
          create: productIds.map((productId: string) => ({
            Product: { connect: { id: productId } },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${request.headers.get("origin")}/cart?success=true`,
      cancel_url: `${request.headers.get("origin")}/cart?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { url: session.url },
      {
        status: 201,
        headers: corsHeader,
      },
    );
  } catch (error) {
    console.error("[STOREID]_CHECKOUT_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
