import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    if (!params.storeId || !params.colorId) {
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

    const color = await prisma.category.findUnique({
      where: { id: params.colorId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${color?.name} color for the ${store.name} store retrieved successfully.`,
        store,
        color,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_COLORS_[COLORID]_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.colorId) {
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

    const color = await prisma.color.update({
      where: { id: params.colorId, storeId: params.storeId },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${color.name} color for the ${store.name} store updated successfully.`,
        store,
        color,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_COLORS_[COLORID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.colorId) {
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

    const color = await prisma.color.delete({
      where: { id: params.colorId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${color.name} color for the ${store.name} store deleted successfully.`,
        store,
        color,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_COLORS_[COLORID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
