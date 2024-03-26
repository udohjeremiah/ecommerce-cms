"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Store } from "@prisma/client";
import { LoaderCircleIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

interface DeleteDialogProps {
  store: Store;
}

export default function DeleteStoreDialog({ store }: DeleteDialogProps) {
  const [openDeleteDialog, setopenDeleteDialog] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();

  const onStoreDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/stores/${params.storeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { store } = await response.json();
      setIsDeleting(false);
      router.push("/");
      toast.success(`🎉 ${store.name} store deleted successfully.`);
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <AlertDialog
      open={openDeleteDialog}
      onOpenChange={(open) => {
        if (!open) {
          setStoreName("");
        }
        setopenDeleteDialog(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={cn("ml-auto w-max", "ml-0")}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete Store
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <Alert variant="destructive">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle>Danger</AlertTitle>
            <AlertDescription>
              Unexpected bad things will happen if you don&apos;t read this!
            </AlertDescription>
          </Alert>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete this store
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="storeName" className="select-none">
              To confirm, type &quot;{store.name}&quot; in the input field below
            </Label>
            <Input
              id="storeName"
              disabled={isDeleting}
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={storeName !== store.name || isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onStoreDelete();
            }}
          >
            {isDeleting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Deleting
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
