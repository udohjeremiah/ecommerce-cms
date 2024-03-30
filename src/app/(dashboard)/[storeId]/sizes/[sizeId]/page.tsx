import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteSizeDialog from "@/components/dialogs/DeleteSizeDialog";
import SizeForm from "@/components/forms/SizeForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface SizePageProps {
  params: { storeId: string; sizeId: string };
}

export async function generateMetadata({
  params,
}: {
  params: { storeId: string; sizeId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  const size = await prisma.size.findUnique({
    where: { id: params.sizeId, storeId: params.storeId },
  });

  return {
    title: `${store?.name} Store ${size?.name} Size | E-Commerce CMS`,
    description: `Manage the ${size?.name} size for your ${store?.name} store.`,
  };
}

export default async function SizePage({ params }: SizePageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
  }

  const size = await prisma.size.findUnique({
    where: { id: params.sizeId, storeId: store.id },
  });

  if (!size) {
    redirect(`/${store.id}/sizes`);
  }

  return (
    <main
      className={cn(
        "container flex flex-1 flex-col gap-4 py-4",
        "md:gap-8 md:py-8",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          "md:flex-row md:items-center md:justify-between",
        )}
      >
        <Heading
          title={`${store?.name} Store Billboard`}
          description={`Manage this billboard for your ${store?.name} store.`}
        />
        <DeleteSizeDialog
          size={{
            id: size.id,
            name: size.name,
            value: size.value,
            createdAt: format(size.createdAt, "MMMM do, yyyy"),
          }}
          triggerBtnClassName="w-max"
        />
      </div>
      <Separator />
      <SizeForm size={size} />
      <Separator />
      <Heading title="API" description="API calls for billboard" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          {
            title: "GET",
            variant: "public",
            route: `sizes/{sizeId}`,
          },
          {
            title: "PATCH",
            variant: "admin",
            route: `sizes/{sizeId}`,
          },
          {
            title: "DELETE",
            variant: "admin",
            route: `sizes/{sizeId}`,
          },
        ]}
      />
    </main>
  );
}
