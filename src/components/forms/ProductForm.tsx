"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { ImageUpIcon, LoaderCircleIcon } from "lucide-react";
import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodType, z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

interface ProductFormProps {
  product: Product;
  images: Image[];
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

const nameFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Product name must be at least 1 characters.",
    })
    .max(120, {
      message: "Product name must be at most 120 characters.",
    }),
});

const imagesFormSchema = z.object({
  images: z.string().array().min(1, {
    message: "Product must have at least 1 image.",
  }),
});

const priceFormSchema = z.object({
  price: z.coerce
    .number()
    .positive({ message: "Product price must be greater than 0." }),
});

const categoryFormSchema = z.object({
  categoryId: z.string().uuid({ message: "Category ID must be a valid UUID." }),
});

const colorFormSchema = z.object({
  colorId: z.string().uuid({ message: "Color ID must be a valid UUID." }),
});

const sizeFormSchema = z.object({
  sizeId: z.string().uuid({ message: "Size ID must be a valid UUID." }),
});

const checkboxFormSchema = z.object({
  isFeatured: z.boolean({
    required_error: "Featured is required.",
    invalid_type_error: "Featured must be either true or false.",
  }),
  isArchived: z.boolean({
    required_error: "Archived is required.",
    invalid_type_error: "Archived must be either true or false.",
  }),
});

export default function ProductForm({
  product,
  images,
  categories,
  sizes,
  colors,
}: ProductFormProps) {
  const [imagesPublicIds, setImagesPublicIds] = useState(
    images.map((image) => image.imagePublicId),
  );

  const params = useParams();
  const router = useRouter();

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: product.name,
    },
  });

  const imagesForm = useForm<z.infer<typeof imagesFormSchema>>({
    resolver: zodResolver(imagesFormSchema),
    defaultValues: {
      images: images.map((image) => image.imagePublicId),
    },
  });

  const priceForm = useForm<z.infer<typeof priceFormSchema>>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: Number(product.price),
    },
  });

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryId: product.categoryId,
    },
  });

  const colorForm = useForm<z.infer<typeof colorFormSchema>>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      colorId: product.colorId,
    },
  });

  const sizeForm = useForm<z.infer<typeof sizeFormSchema>>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: {
      sizeId: product.sizeId,
    },
  });

  const checkboxForm = useForm<z.infer<typeof checkboxFormSchema>>({
    resolver: zodResolver(checkboxFormSchema),
    defaultValues: {
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
    },
  });

  const { user } = useUser();

  useEffect(() => {
    imagesForm.setValue("images", imagesPublicIds);
  }, [imagesForm, imagesPublicIds]);

  const onSubmit = async <T extends ZodType<any, any, any>>(
    values: z.infer<T>,
  ) => {
    try {
      const response = await fetch(
        `/api/${params.storeId}/products/${params.productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { store } = await response.json();
      router.refresh();
      toast.success(
        `🎉 ${product.name} product for the ${store.name} store updated successfully.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <div className={cn("grid gap-6", "lg:grid-cols-2")}>
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>
            Used to identify your product within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...nameForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={nameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={nameForm.formState.isSubmitting}
                          placeholder="Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={nameForm.formState.isSubmitting}
            onClick={nameForm.handleSubmit(onSubmit<typeof nameFormSchema>)}
          >
            {nameForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>The images shown on your product.</CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            "grid grid-cols-1 items-center justify-center space-y-2",
            "sm:grid-cols-2",
          )}
        >
          {imagesPublicIds.map((publicId, index) => (
            <CldImage
              key={index}
              src={publicId}
              alt=""
              width="200"
              height="200"
              priority
            />
          ))}
        </CardContent>
        <CardFooter className="space-x-4 border-t px-6 py-4">
          {user?.id && (
            <Button
              asChild
              variant="secondary"
              type="button"
              disabled={imagesForm.formState.isSubmitting}
            >
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ folder: `ecommerce-cms/${user.id}/product` }}
                onUploadAdded={() => setImagesPublicIds([])}
                onSuccess={(results) => {
                  if (typeof results?.info === "object") {
                    const info = results.info as CloudinaryUploadWidgetInfo;
                    setImagesPublicIds((prevImages) => [
                      ...prevImages,
                      info.public_id,
                    ]);
                  }
                }}
                className="flex items-center"
              >
                <ImageUpIcon className="mr-2 h-4 w-4" /> Change
              </CldUploadButton>
            </Button>
          )}
          <Button
            type="submit"
            disabled={imagesForm.formState.isSubmitting}
            onClick={imagesForm.handleSubmit(onSubmit<typeof imagesFormSchema>)}
          >
            {imagesForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Price</CardTitle>
          <CardDescription>
            Used as the price for your product within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...priceForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={priceForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={priceForm.formState.isSubmitting}
                          placeholder="Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={priceForm.formState.isSubmitting}
            onClick={priceForm.handleSubmit(onSubmit<typeof priceFormSchema>)}
          >
            {priceForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category ID</CardTitle>
          <CardDescription>
            Used to identify the category for this product within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...categoryForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={categoryForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={priceForm.formState.isSubmitting}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={categoryForm.formState.isSubmitting}
            onClick={categoryForm.handleSubmit(
              onSubmit<typeof categoryFormSchema>,
            )}
          >
            {categoryForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Size ID</CardTitle>
          <CardDescription>
            Used to identify the size for this product within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...sizeForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={sizeForm.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={priceForm.formState.isSubmitting}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={sizeForm.formState.isSubmitting}
            onClick={sizeForm.handleSubmit(onSubmit<typeof sizeFormSchema>)}
          >
            {sizeForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Color ID</CardTitle>
          <CardDescription>
            Used to identify the color for this product within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...colorForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={colorForm.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={priceForm.formState.isSubmitting}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={colorForm.formState.isSubmitting}
            onClick={colorForm.handleSubmit(onSubmit<typeof colorFormSchema>)}
          >
            {colorForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Featured & Archived</CardTitle>
          <CardDescription>
            Used to identify if this product is featured or archived within its
            store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...checkboxForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={checkboxForm.control}
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
                          This adds the product to the featured products.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={checkboxForm.control}
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
                          This adds the product to the archived products.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            type="submit"
            disabled={checkboxForm.formState.isSubmitting}
            onClick={checkboxForm.handleSubmit(
              onSubmit<typeof checkboxFormSchema>,
            )}
          >
            {checkboxForm.formState.isSubmitting ? (
              <>
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
