import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    if (!params.storeId || !params.productId) {
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

    const product = await prisma.product.findUnique({
      where: { id: params.productId, storeId: params.storeId },
      include: {
        Category: true,
        Size: true,
        Color: true,
        Image: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Product for the ${store.name} store retrieved successfully.`,
        store,
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_PRODUCTS_[PRODUCTID]_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.productId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findFirst({
      where: { id: params.storeId, userId: user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const requestData = await request.json();
    const updatedFields = { ...requestData };

    let product = {};
    if (updatedFields?.images) {
      await prisma.product.update({
        where: { id: params.productId, storeId: params.storeId },
        data: { Image: { deleteMany: {} } },
      });

      product = await prisma.product.update({
        where: { id: params.productId, storeId: params.storeId },
        data: {
          Image: {
            createMany: {
              data: updatedFields.images.map((image: { image: string }) => ({
                imagePublicId: image,
              })),
            },
          },
        },
      });
    } else {
      product = await prisma.product.update({
        where: { id: params.productId, storeId: params.storeId },
        data: updatedFields,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Product for the ${store.name} store updated successfully.`,
        store,
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_PRODUCTS_[PRODUCTID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.productId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const store = await prisma.store.findFirst({
      where: { id: params.storeId, userId: user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const product = await prisma.product.delete({
      where: { id: params.productId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Product for the ${store.name} store deleted successfully.`,
        store,
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_PRODUCTS_[PRODUCTID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
