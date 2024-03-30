import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    if (!params.storeId || !params.sizeId) {
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

    const size = await prisma.category.findUnique({
      where: { id: params.sizeId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${size?.name} size for the ${store.name} store retrieved successfully.`,
        store,
        size,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_SIZES_[SIZESID]_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.sizeId) {
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

    const size = await prisma.size.update({
      where: { id: params.sizeId, storeId: params.storeId },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${size.name} size for the ${store.name} store updated successfully.`,
        store,
        size,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_SIZES_[SIZESID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.sizeId) {
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

    const size = await prisma.size.delete({
      where: { id: params.sizeId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${size.name} size for the ${store.name} store deleted successfully.`,
        store,
        size,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_SIZES_[SIZESID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
