import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import APIList from "@/components/APIList";
import Heading from "@/components/Heading";
import DeleteStoreDialog from "@/components/dialogs/DeleteStoreDialog";
import SettingsForm from "@/components/forms/SettingsForm";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

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
          title="Settings"
          description={`Manage the preferences for your ${store.name} store.`}
        />
        <DeleteStoreDialog store={store} />
      </div>
      <Separator />
      <SettingsForm store={store} />
      <Separator />
      <Heading title="API" description="API calls for settings" />
      <APIList
        apis={[
          {
            title: "NEXT_PUBLIC_API_URL",
            variant: "public",
            route: "",
          },
        ]}
      />
    </main>
  );
}
