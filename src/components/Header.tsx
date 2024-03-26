import { redirect } from "next/navigation";

import { auth, UserButton } from "@clerk/nextjs";

import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function Header() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const stores = await prisma.store.findMany({
    where: { userId },
  });

  return (
    <header className="sticky top-0 border-b bg-background">
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
