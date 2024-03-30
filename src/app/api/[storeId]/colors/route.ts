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

    const colors = await prisma.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Colors for the ${store.name} store retrieved successfully.`,
        store,
        colors,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_COLORS_GET] Error:", error);
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

    const { name, value } = await request.json();

    if (!name || !value) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New category created successfully.",
        store,
        color,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_COLORS_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
