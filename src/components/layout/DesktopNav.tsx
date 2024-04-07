"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { routes } from "@/data/routes";

import { useMediaQuery } from "@/hooks/use-media-query";

import { cn } from "@/lib/utils";

export default function DesktopNav() {
  const params = useParams();
  const pathName = usePathname();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex flex-row items-center gap-5 text-sm font-medium",
        "lg:gap-6",
      )}
    >
      {routes.map(({ href, label, active }, index) => (
        <Link
          key={index}
          href={`/${params.storeId}/${href}`}
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
  );
}
