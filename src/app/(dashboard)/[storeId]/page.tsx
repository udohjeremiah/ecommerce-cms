import type { Metadata } from "next";

import { auth } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { storeId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  return {
    title: `${store?.name} Store | E-Commerce CMS`,
    description: `Manage your online ${store?.name} store and its content, from product management and order processing to customization and more.`,
  };
}

interface DashboardPageProps {
  params: { storeId: string };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return (
    <main
      className={cn(
        "container flex flex-1 flex-col gap-4 py-4",
        "md:gap-8 md:py-8",
      )}
    ></main>
  );
}
