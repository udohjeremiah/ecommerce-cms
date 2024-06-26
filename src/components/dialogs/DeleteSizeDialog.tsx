"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { LoaderCircleIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { SizeColumn } from "@/components/columns/SizeColumns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
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

interface DeleteSizeDialogProps {
  defaultState?: boolean;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  size: SizeColumn;
}

export default function DeleteSizeDialog({
  defaultState = false,
  open,
  setOpen,
  size,
}: DeleteSizeDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [sizeName, setSizeName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();

  if (defaultState) {
    open = defaultOpen;
    setOpen = setDefaultOpen;
  }

  const onSizeDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/${params.storeId}/sizes/${size.id}`, {
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
      setOpen?.(false);
      router.refresh();
      toast.success(
        `🙂 ${size.name} size for the ${store.name} store deleted successfully.`,
      );
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setSizeName("");
        }
        setOpen?.(open);
      }}
    >
      {defaultState && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-max">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Size
          </Button>
        </AlertDialogTrigger>
      )}
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
            This action cannot be undone. It will permanently delete this size
            and remove all associated data from our servers. Please ensure that
            you remove all products associated with this size before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="sizeName" className="select-none">
              To confirm, type &quot;{size.name}&quot; in the input field below
            </Label>
            <Input
              id="sizeName"
              disabled={isDeleting}
              value={sizeName}
              onChange={(e) => setSizeName(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={sizeName !== size.name || isDeleting}
            onClick={onSizeDelete}
          >
            {isDeleting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
