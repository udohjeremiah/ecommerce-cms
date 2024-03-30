import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import { SizeColumn, columns } from "@/components/columns/SizeColumns";
import CreateSizeDialog from "@/components/dialogs/CreateSizeDialog";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface SizesPageProps {
  params: { storeId: string };
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
    title: `${store?.name} Store Sizes | E-Commerce CMS`,
    description: `Manage the sizes for your ${store?.name} store.`,
  };
}

export default async function SizesPage({ params }: SizesPageProps) {
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

  const sizes = await prisma.size.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

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
          title={`Sizes (${sizes.length})`}
          description={`Manage the sizes for your ${store.name} store.`}
        />
        <CreateSizeDialog />
      </div>
      <Separator />
      <DataTable columns={columns} filterColumn="name" data={formattedSizes} />
      <Separator />
      <Heading title="API" description="API calls for sizes" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          { title: "GET", route: "sizes", variant: "public" },
          {
            title: "GET",
            variant: "public",
            route: `sizes/{sizeId}`,
          },
          {
            title: "POST",
            variant: "admin",
            route: `sizes`,
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
