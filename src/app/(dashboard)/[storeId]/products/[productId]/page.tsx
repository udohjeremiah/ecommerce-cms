import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteProductDialog from "@/components/dialogs/DeleteProductDialog";
import ProductForm from "@/components/forms/ProductForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface ProductPageProps {
  params: { storeId: string; productId: string };
}

export async function generateMetadata({
  params,
}: {
  params: { storeId: string; productId: string };
}): Promise<Metadata> {
  const { userId } = auth();

  if (!userId) {
    return {};
  }

  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  const product = await prisma.product.findUnique({
    where: { id: params.productId, storeId: params.storeId },
  });

  return {
    title: `${store?.name} Store ${product?.name} Product | E-Commerce CMS`,
    description: `Manage the ${product?.name} product for your ${store?.name} store.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
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

  const product = await prisma.product.findUnique({
    where: { id: params.productId, storeId: store.id },
    include: {
      Category: true,
      Size: true,
      Color: true,
      Image: true,
    },
  });

  if (!product) {
    redirect(`/${store.id}/products`);
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
          title={`${store?.name} Store Product`}
          description={`Manage this product for your ${store?.name} store.`}
        />
        <DeleteProductDialog
          defaultState={true}
          product={{
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
          }}
        />
      </div>
      <Separator />
      <ProductForm
        product={product}
        images={product.Image}
        categories={categories}
        sizes={sizes}
        colors={colors}
      />
      <Separator />
      <Heading title="API" description="API calls for product" />
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
            route: `products/{productId}`,
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
