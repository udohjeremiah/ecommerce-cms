import { redirect } from "next/navigation";

import { UserButton, auth } from "@clerk/nextjs";

import StoreSwitcher from "@/components/StoreSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import DesktopNav from "@/components/layout/DesktopNav";
import MobileNav from "@/components/layout/MobileNav";

import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function Header() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const stores = await prisma.store.findMany({
    where: { userId },
  });

  return (
    <header className="sticky top-0 z-50 border-b bg-background backdrop-blur">
      <div
        className={cn(
          "container flex items-center justify-between gap-4 p-4",
          "md:px-6",
        )}
      >
        <MobileNav />
        <StoreSwitcher stores={stores} />
        <DesktopNav />
        <div className="flex gap-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
