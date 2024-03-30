import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
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

    const categories = await prisma.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Categories for the ${store.name} store retrieved successfully.`,
        store,
        categories,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_CATEGORIES_GET] Error:", error);
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

    const { name, billboardId } = await request.json();

    if (!name || !billboardId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New category created successfully.",
        store,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_CATEGORIES_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
