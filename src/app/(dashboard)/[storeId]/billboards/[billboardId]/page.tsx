import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteBillboardDialog from "@/components/dialogs/DeleteBillboardDialog";
import BillboardForm from "@/components/forms/BillboardForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface BillboardPageProps {
  params: { storeId: string; billboardId: string };
}

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
    title: `${store?.name} Store Billboard | E-Commerce CMS`,
    description: `Manage this billboard for your ${store?.name} store.`,
  };
}

export default async function BillboardPage({ params }: BillboardPageProps) {
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

  const billboard = await prisma.billboard.findUnique({
    where: { id: params.billboardId, storeId: store.id },
  });

  if (!billboard) {
    redirect(`/${store.id}/billboards`);
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
        <DeleteBillboardDialog
          defaultState={true}
          billboard={{
            id: billboard.id,
            label: billboard.label,
            createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
          }}
        />
      </div>
      <Separator />
      <BillboardForm billboard={billboard} />
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
            route: `billboards/{billboardId}`,
          },
          {
            title: "PATCH",
            variant: "admin",
            route: `billboards/{billboardId}`,
          },
          {
            title: "DELETE",
            variant: "admin",
            route: `billboards/{billboardId}`,
          },
        ]}
      />
    </main>
  );
}
