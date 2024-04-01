import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

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

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        Category: true,
        Size: true,
        Color: true,
        Image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Products for the ${store.name} store retrieved successfully.`,
        store,
        products,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_PRODUCTS_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId) {
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

    const {
      name,
      imagesPublicIds,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = await request.json();

    if (
      !name ||
      !imagesPublicIds.length ||
      !price ||
      !categoryId ||
      !sizeId ||
      !colorId
    ) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        Image: {
          createMany: {
            data: imagesPublicIds.map(
              (imagePublicId: { imagePublicId: string }) => ({
                imagePublicId,
              }),
            ),
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New product created successfully.",
        store,
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_PRODUCTS_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
