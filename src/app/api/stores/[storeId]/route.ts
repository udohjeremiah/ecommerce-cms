import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function PATCH(
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

    const requestData = await request.json();
    const updatedFields = { ...requestData };

    const store = await prisma.store.update({
      where: { id: params.storeId, userId: user.id },
      data: updatedFields,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${store.name} store updated successfully.`,
        store,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STORES_[STOREID]_PATCH] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

export async function DELETE(
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

    const store = await prisma.store.delete({
      where: { id: params.storeId, userId: user.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${store.name} store deleted successfully.`,
        store,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STORES_[STOREID]_DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
