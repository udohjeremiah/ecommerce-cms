import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import { format } from "date-fns";

import APIList from "@/components/APIList";
import { BillboardColumn, columns } from "@/components/BillboardColumns";
import DataTable from "@/components/DataTable";
import Heading from "@/components/Heading";
import CreateBillboardDialog from "@/components/dialogs/CreateBillboardDialog";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

interface BillboardsPageProps {
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
    title: `${store?.name} Store Billboards | E-Commerce CMS`,
    description: `Manage the billboards for your ${store?.name} store.`,
  };
}

export default async function BillboardsPage({ params }: BillboardsPageProps) {
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
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
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
          title={`Billboards (${billboards.length})`}
          description={`Manage the billboards for your ${store.name} store.`}
        />
        <CreateBillboardDialog userId={userId} />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        filterColumn="label"
        data={formattedBillboards}
      />
      <Separator />
      <Heading title="API" description="API calls for billboards" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
          { title: "GET", route: "billboards", variant: "public" },
          {
            title: "GET",
            variant: "public",
            route: `billboards/{billboardId}`,
          },
          {
            title: "POST",
            variant: "admin",
            route: `billboards`,
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
