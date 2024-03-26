import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import Heading from "@/components/Heading";
import SettingsForm from "@/components/forms/SettingsForm";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import DeleteStoreDialog from "@/components/DeleteStoreDialog";

interface SettingsPageProps {
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
    title: `${store?.name} Store Settings | E-Commerce CMS`,
    description: `Manage the preferences for your ${store?.name} store.`,
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
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

  return (
    <main
      className={cn("container flex flex-1 flex-col gap-4 py-4", "md:py-8")}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          "md:flex-row md:items-center md:justify-between",
        )}
      >
        <Heading
          title="Settings"
          description={`Manage the preferences for your ${store.name} store.`}
        />
        <DeleteStoreDialog store={store} />
      </div>
      <Separator />
      <SettingsForm store={store} />
    </main>
  );
}
