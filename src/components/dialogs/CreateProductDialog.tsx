"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Size } from "@prisma/client";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Product name must be at least 4 characters.",
    })
    .max(120, {
      message: "Product name must be at most 120 characters.",
    }),
  images: z
    .any()
    .refine((files) => files?.length !== 0, "Images are required."),
  price: z.coerce
    .number()
    .positive({ message: "Product price must be greater than 0." }),
  categoryId: z.string().uuid({ message: "Category ID must be a valid UUID." }),
  colorId: z.string().uuid({ message: "Color ID must be a valid UUID." }),
  sizeId: z.string().uuid({ message: "Size ID must be a valid UUID." }),
  isFeatured: z.boolean({
    required_error: "Featured is required.",
    invalid_type_error: "Featured must be either true or false.",
  }),
  isArchived: z.boolean({
    required_error: "Archived is required.",
    invalid_type_error: "Archived must be either true or false.",
  }),
});

interface CreateProductDialogProps {
  userId: string;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

export default function CreateProductDialog({
  userId,
  categories,
  sizes,
  colors,
}: CreateProductDialogProps) {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      colorId: "",
      sizeId: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const imagesPublicIds = [];
      const formData = new FormData();

      for (let i = 0; i < values.images.length; i++) {
        let file = values.images[i];
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
        );
        formData.append("folder", `ecommerce-cms/${userId}/product`);

        let uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        let { public_id } = await uploadResponse.json();
        imagesPublicIds.push(public_id);
      }

      const response = await fetch(`/api/${params.storeId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...values,
          imagesPublicIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { store } = await response.json();
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success(
        `🎉 New product for the ${store.name} store has been created successfully.`,
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
      <DialogContent className="p-0">
        <ScrollArea className="max-h-[600px]">
          <div className="grid gap-4 p-6">
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>
                Add a new product to your store and efficiently manage your
                products, categories, and more.
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
                          placeholder="e.g., Suits"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the name of your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={form.formState.isSubmitting}
                          {...field}
                          value={field.value?.fileName}
                          onChange={(event) =>
                            form.setValue("images", event.target.files)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        These are the images for your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={form.formState.isSubmitting}
                          placeholder="e.g., 9.99"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the price of your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category ID</FormLabel>
                      <Select
                        disabled={form.formState.isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category ID to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category, index) => (
                            <SelectItem key={index} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the category for your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size ID</FormLabel>
                      <Select
                        disabled={form.formState.isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a size ID to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizes.map((size, index) => (
                            <SelectItem key={index} value={size.id}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the size for your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color ID</FormLabel>
                      <Select
                        disabled={form.formState.isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a color ID to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map((color, index) => (
                            <SelectItem key={index} value={color.id}>
                              {color.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is the color for your new product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          This adds your new product to the featured products.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isArchived"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Archived</FormLabel>
                        <FormDescription>
                          This adds your new product to the archived products.
                        </FormDescription>
                      </div>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
