"use client";

import { useParams } from "next/navigation";

import { CopyIcon, ServerIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useMounted } from "@/hooks/use-mounted";

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

  const isMounted = useMounted();

  const baseUrl = `${window.location.origin}/api/${params.storeId}`;

  if (!isMounted) {
    return null;
  }

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
          <AlertDescription className="mt-4 flex items-center gap-4">
            <code
              className={cn(
                "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 font-mono text-sm font-medium shadow-sm transition-colors",
                variant === "admin"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-secondary text-secondary-foreground",
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
