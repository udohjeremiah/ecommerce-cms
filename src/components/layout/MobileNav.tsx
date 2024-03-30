"use client";

import { useState } from "react";

import Link from "next/link";

import { useParams, usePathname } from "next/navigation";

import { MenuIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { routes } from "@/data/routes";

import { useMediaQuery } from "@/hooks/use-media-query";

import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const pathName = usePathname();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="mt-4 grid gap-6 text-lg font-medium">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2 text-lg font-bold",
              "md:text-base",
            )}
          >
            <div className="rounded-full bg-foreground p-2 text-background">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            E-Commerce CMS
          </Link>
          {routes.map(({ href, label, active }, index) => (
            <Link
              key={index}
              href={`/${params.storeId}/${href}`}
              onClick={() => setOpen(false)}
              className={cn(
                "text-muted-foreground transition-colors",
                "hover:text-foreground",
                active(pathName, `/${params.storeId}${href && `/${href}`}`) &&
                  "text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
