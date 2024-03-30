import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    if (!params.storeId || !params.categoryId) {
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

    const category = await prisma.category.findUnique({
      where: { id: params.categoryId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${category?.name} category for the ${store.name} store retrieved successfully.`,
        store,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_CATEGORIES_[CATEGORYID]_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.categoryId) {
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

    const category = await prisma.category.update({
      where: { id: params.categoryId, storeId: params.storeId },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${category.name} category for the ${store.name} store updated successfully.`,
        store,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_CATEGORIES_[CATEGORYID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.categoryId) {
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

    const category = await prisma.category.delete({
      where: { id: params.categoryId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${category.name} category for the ${store.name} store deleted successfully.`,
        store,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_CATEGORIES_[CATEGORYID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
