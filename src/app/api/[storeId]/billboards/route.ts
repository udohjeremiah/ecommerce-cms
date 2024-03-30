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

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Billboards for ${store.name} store retrieved successfully.`,
        store,
        billboards,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_BILLBOARDS_GET] Error:", error);
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

    const { label, imagePublicId } = await request.json();

    if (!label || !imagePublicId) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imagePublicId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New billboard created successfully.",
        store,
        billboard,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_BILLBOARDS_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
