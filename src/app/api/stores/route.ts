import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Bad Request" },
        { status: 400 },
      );
    }

    const store = await prisma.store.create({
      data: { name, userId: user.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "New store created successfully.",
        store,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[STORES_POST] Error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
