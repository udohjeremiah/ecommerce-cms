import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import { ColorColumn, columns } from "@/components/columns/ColorColumns";
import CreateColorDialog from "@/components/dialogs/CreateColorDialog";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface ColorsPageProps {
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
    title: `${store?.name} Store Colors | E-Commerce CMS`,
    description: `Manage the colors for your ${store?.name} store.`,
  };
}

export default async function ColorsPage({ params }: ColorsPageProps) {
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

  const colors = await prisma.color.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
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
          title={`Colors (${colors.length})`}
          description={`Manage the colors for your ${store.name} store.`}
        />
        <CreateColorDialog />
      </div>
      <Separator />
      <DataTable columns={columns} filterColumn="name" data={formattedColors} />
      <Separator />
      <Heading title="API" description="API calls for colors" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          { title: "GET", route: "colors", variant: "public" },
          {
            title: "GET",
            variant: "public",
            route: `colors/{colorId}`,
          },
          {
            title: "POST",
            variant: "admin",
            route: `colors`,
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
