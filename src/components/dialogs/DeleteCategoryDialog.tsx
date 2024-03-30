"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { LoaderCircleIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { CategoryColumn } from "@/components/columns/CategoryColumns";
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

interface DeleteCategoryDialogProps {
  category: CategoryColumn;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  triggerBtnClassName: string;
}

export default function DeleteCategoryDialog({
  category,
  variant = "destructive",
  triggerBtnClassName,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const router = useRouter();

  const onBillboardDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/${params.storeId}/categories/${category.id}`,
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
      router.refresh();
      toast.success(
        `🙂 ${category.name} category for the ${store.name} store deleted successfully.`,
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
          setCategoryName("");
        }
        setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={triggerBtnClassName}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete Category
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
            This action cannot be undone. It will permanently delete this
            category and remove all associated data from our servers. Please
            ensure that you remove all products associated with this category
            before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="storeName" className="select-none">
              To confirm, type &quot;{category.name}&quot; in the input field
              below
            </Label>
            <Input
              id="storeName"
              disabled={isDeleting}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={categoryName !== category.name || isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onBillboardDelete();
            }}
          >
            {isDeleting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
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
