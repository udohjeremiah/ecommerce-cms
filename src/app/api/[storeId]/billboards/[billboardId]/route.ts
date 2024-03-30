import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    if (!params.storeId || !params.billboardId) {
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

    const billboard = await prisma.billboard.findUnique({
      where: { id: params.billboardId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Billboard for ${store.name} store retrieved successfully.`,
        store,
        billboard,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_BILLBOARDS_[BILLBOARDID]_GET] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.billboardId) {
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

    const billboard = await prisma.billboard.update({
      where: { id: params.billboardId, storeId: params.storeId },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Billboard for ${store.name} store updated successfully.`,
        store,
        billboard,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_BILLBOARDS_[BILLBOARDID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!params.storeId || !params.billboardId) {
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

    const billboard = await prisma.billboard.delete({
      where: { id: params.billboardId, storeId: params.storeId },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Billboard for ${store.name} store deleted successfully.`,
        store,
        billboard,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STOREID]_BILLBOARDS_[BILLBOARDID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
