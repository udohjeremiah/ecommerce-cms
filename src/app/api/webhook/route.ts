import { headers } from "next/headers";
import { NextResponse } from "next/server";

import Stripe from "stripe";

import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressString = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ]
      .filter((c) => c !== null)
      .join(", ");

    if (event.type === "checkout.session.completed") {
      const order = await prisma.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          name: session?.customer_details?.name || "",
          email: session?.customer_details?.email || "",
          phone: session?.customer_details?.phone || "",
          address: addressString,
        },
        include: {
          OrderItem: true,
        },
      });

      // Use this code if you want each product to be archived upon purchase.
      // Otherwise, manually update products as archived in the admin panel.
      /*
        const productIds = order.OrderItem.map(
          (orderItem) => orderItem.productId,
        );

        await prisma.product.updateMany({
          where: { id: { in: [...productIds] } },
          data: { isArchived: true },
        });
      */

      return NextResponse.json(null, { status: 200 });
    }
  } catch (error) {
    console.error("[STOREID]_WEBHOOK_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
