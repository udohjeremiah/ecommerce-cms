import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";

import prisma from "@/lib/prisma";

export default async function RootPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({ where: { userId } });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <CreateStoreDialog initialState={true} />;
}
