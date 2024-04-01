import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import { ProductColumn, columns } from "@/components/columns/ProductColumns";
import CreateProductDialog from "@/components/dialogs/CreateProductDialog";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface ProductsPageProps {
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
    title: `${store?.name} Store Products | E-Commerce CMS`,
    description: `Manage the products for your ${store?.name} store.`,
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
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

  const categories = await prisma.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prisma.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prisma.color.findMany({
    where: { storeId: params.storeId },
  });

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: {
      Category: true,
      Size: true,
      Color: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.price.toNumber()),
    category: product.Category.name,
    size: product.Size.name,
    color: product.Color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
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
          title={`Products (${products.length})`}
          description={`Manage the products for your ${store.name} store.`}
        />
        <CreateProductDialog
          userId={userId}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        filterColumn="name"
        data={formattedProducts}
      />
      <Separator />
      <Heading title="API" description="API calls for products" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          { title: "GET", route: "products", variant: "public" },
          {
            title: "GET",
            variant: "public",
            route: `products/{productId}`,
          },
          {
            title: "POST",
            variant: "admin",
            route: `products`,
          },
          {
            title: "PATCH",
            variant: "admin",
            route: `products/{productId}`,
          },
          {
            title: "DELETE",
            variant: "admin",
            route: `products/{productId}`,
          },
        ]}
      />
    </main>
  );
}
