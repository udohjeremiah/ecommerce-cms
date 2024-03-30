import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteColorDialog from "@/components/dialogs/DeleteColorDialog";
import ColorForm from "@/components/forms/ColorForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface ColorPageProps {
  params: { storeId: string; colorId: string };
}

export async function generateMetadata({
  params,
}: {
  params: { storeId: string; colorId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  const color = await prisma.color.findUnique({
    where: { id: params.colorId, storeId: params.storeId },
  });

  return {
    title: `${store?.name} Store ${color?.name} Color | E-Commerce CMS`,
    description: `Manage the ${color?.name} color for your ${store?.name} store.`,
  };
}

export default async function ColorPage({ params }: ColorPageProps) {
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

  const color = await prisma.color.findUnique({
    where: { id: params.colorId, storeId: store.id },
  });

  if (!color) {
    redirect(`/${store.id}/colors`);
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
        <DeleteColorDialog
          color={{
            id: color.id,
            name: color.name,
            value: color.value,
            createdAt: format(color.createdAt, "MMMM do, yyyy"),
          }}
          triggerBtnClassName="w-max"
        />
      </div>
      <Separator />
      <ColorForm color={color} />
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
            route: `colors/{colorId}`,
          },
          {
            title: "PATCH",
            variant: "admin",
            route: `colors/{colorId}`,
          },
          {
            title: "DELETE",
            variant: "admin",
            route: `colors/{colorId}`,
          },
        ]}
      />
    </main>
  );
}
