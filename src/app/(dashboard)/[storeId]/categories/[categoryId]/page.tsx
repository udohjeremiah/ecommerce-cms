import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteCategoryDialog from "@/components/dialogs/DeleteCategoryDialog";
import CategoryForm from "@/components/forms/CategoryForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

interface CategoryPageProps {
  params: { storeId: string; categoryId: string };
}

export async function generateMetadata({
  params,
}: {
  params: { storeId: string; categoryId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  const category = await prisma.category.findUnique({
    where: { id: params.categoryId, storeId: params.storeId },
  });

  return {
    title: `${store?.name} Store ${category?.name} Category | E-Commerce CMS`,
    description: `Manage the ${category?.name} for your ${store?.name} store.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
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

  const category = await prisma.category.findUnique({
    where: { id: params.categoryId, storeId: store.id },
    include: { Billboard: true },
  });

  if (!category) {
    redirect(`/${store.id}/categories`);
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
          title={`${store?.name} Store ${category?.name} Category`}
          description={`Manage the ${category.name} category for your ${store?.name} store.`}
        />
        <DeleteCategoryDialog
          category={{
            id: category.id,
            name: category.name,
            billboardLabel: category.Billboard.label,
            createdAt: format(category.createdAt, "MMMM do, yyyy"),
          }}
          triggerBtnClassName="w-max"
        />
      </div>
      <Separator />
      <CategoryForm billboards={billboards} category={category} />
      <Separator />
      <Heading title="API" description="API calls for category" />
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
            route: `categories/{categoryId}`,
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
