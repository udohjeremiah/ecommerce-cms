"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Color name must be at least 1 characters.",
    })
    .max(20, {
      message: "Color name must be at most 20 characters.",
    }),
  value: z
    .string()
    .min(4, {
      message: "Color value must be at least 4 characters.",
    })
    .max(7, {
      message: "Color value must be at most 7 characters.",
    })
    .regex(/^#[0-9A-Fa-f]{3,6}$/, {
      message: "Color value must be a valid hex code.",
    }),
});

export default function CreateColorDialog() {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/${params.storeId}/colors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { store } = await response.json();
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success(
        `🎉 New color for the ${store.name} store has been created successfully.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className={cn("ml-auto w-max", "ml-0")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Color</DialogTitle>
          <DialogDescription>
            Add a new color to your store and efficiently manage your products,
            categories, and more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="e.g., Blue"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name of your new color.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="e.g., #0000FF"
                        {...field}
                      />
                      <div
                        className="rounded-full border p-4 shadow"
                        style={{ backgroundColor: field.value }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    This is the value of your new color.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Creating
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
