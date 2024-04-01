import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import { OrderColumn, columns } from "@/components/columns/OrderColumns";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface OrdersPageProps {
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
    title: `${store?.name} Store Orders | E-Commerce CMS`,
    description: `Manage the orders for your ${store?.name} store.`,
  };
}

export default async function OrdersPage({ params }: OrdersPageProps) {
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

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      OrderItem: {
        include: { Product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    products: order.OrderItem.map((orderItem) => orderItem.Product.name).join(
      ", ",
    ),
    totalPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(
      order.OrderItem.reduce(
        (total, orderItem) => total + Number(orderItem.Product.price),
        0,
      ),
    ),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main
      className={cn(
        "container flex flex-1 flex-col gap-4 py-4",
        "md:gap-8 md:py-8",
      )}
    >
      <Heading
        title={`Orders (${orders.length})`}
        description={`Manage the orders for your ${store.name} store.`}
      />
      <Separator />
      <DataTable
        columns={columns}
        filterColumn="products"
        data={formattedOrders}
      />
    </main>
  );
}
