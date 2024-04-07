"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { LoaderCircleIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { ColorColumn } from "@/components/columns/ColorColumns";
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

interface DeleteColorDialogProps {
  defaultState?: boolean;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  color: ColorColumn;
}

export default function DeleteColorDialog({
  defaultState = false,
  open,
  setOpen,
  color,
}: DeleteColorDialogProps) {
  const [defaultOpen, setDefaultOpen] = useState(false);
  const [colorName, setColorName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();

  if (defaultState) {
    open = defaultOpen;
    setOpen = setDefaultOpen;
  }

  const onColorDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/${params.storeId}/colors/${color.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { store } = await response.json();
      setIsDeleting(false);
      setOpen?.(false);
      router.refresh();
      toast.success(
        `🙂 ${color.name} color for the ${store.name} store deleted successfully.`,
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
          setColorName("");
        }
        setOpen?.(open);
      }}
    >
      {defaultState && (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-max">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Color
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
            This action cannot be undone. It will permanently delete this color
            and remove all associated data from our servers. Please ensure that
            you remove all products associated with this color before
            proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="colorName" className="select-none">
              To confirm, type &quot;{color.name}&quot; in the input field below
            </Label>
            <Input
              id="colorName"
              disabled={isDeleting}
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={colorName !== color.name || isDeleting}
            onClick={onColorDelete}
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
