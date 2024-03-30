"use client";

import { useParams } from "next/navigation";

import { CopyIcon, ServerIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useWindowOrigin } from "@/hooks/use-window-origin";

import { cn } from "@/lib/utils";

interface APIListProps {
  apis?: {
    title: string;
    variant: "public" | "admin";
    route: string;
  }[];
}

export default function APIList({ apis = [] }: APIListProps) {
  const params = useParams();

  const origin = useWindowOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      {apis.map(({ title, route, variant }, index) => (
        <Alert key={index} className="overflow-x-auto">
          <ServerIcon className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {title}
            <Badge variant={variant === "public" ? "secondary" : "destructive"}>
              {variant}
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-4 flex items-center justify-between gap-4">
            <code
              className={cn(
                "inline-block whitespace-nowrap rounded-lg bg-muted px-2 py-1 font-mono text-sm font-normal",
                variant === "admin" && "bg-destructive",
              )}
            >
              {`${baseUrl}${route && `/${route}`}`}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${baseUrl}${route && `/${route}`}`,
                );
                toast.success("✅ API route copied successfully.");
              }}
              className="shrink-0"
            >
              <CopyIcon className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </>
  );
}
