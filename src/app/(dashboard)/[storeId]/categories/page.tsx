import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import { CategoryColumn, columns } from "@/components/columns/CategoryColumns";
import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import CreateCategoryDialog from "@/components/dialogs/CreateCategoryDialog";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface CategoriesPageProps {
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
    title: `${store?.name} Store Categories | E-Commerce CMS`,
    description: `Manage the categories for your ${store?.name} store.`,
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
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

  const billboards = await prisma.billboard.findMany({
    where: { storeId: params.storeId },
  });

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    include: { Billboard: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.Billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
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
          title={`Categories (${categories.length})`}
          description={`Manage the categories for your ${store.name} store.`}
        />
        <CreateCategoryDialog billboards={billboards} />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        filterColumn="name"
        data={formattedCategories}
      />
      <Separator />
      <Heading title="API" description="API calls for categories" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          { title: "GET", route: "categories", variant: "public" },
          {
            title: "GET",
            variant: "public",
            route: `categories/{categoryId}`,
          },
          {
            title: "POST",
            variant: "admin",
            route: `categories`,
          },
          {
            title: "PATCH",
            variant: "admin",
            route: `categories/{categoryId}`,
          },
          {
            title: "DELETE",
            variant: "admin",
            route: `categories/{categoryId}`,
          },
        ]}
      />
    </main>
  );
}
