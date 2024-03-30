"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
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

interface CategoryFormProps {
  billboards: Billboard[];
  category: Category;
}

const nameFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Category name must be at least 1 characters.",
    })
    .max(20, {
      message: "Category name must be at most 20 characters.",
    }),
});

const billboardIdFormSchema = z.object({
  billboardId: z
    .string()
    .uuid({ message: "Billboard ID must be a valid UUID." }),
});

export default function CategoryForm({
  billboards,
  category,
}: CategoryFormProps) {
  const params = useParams();
  const router = useRouter();

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: category.name,
    },
  });

  const billboardIdForm = useForm<z.infer<typeof billboardIdFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      billboardId: category.billboardId,
    },
  });

  const onNameSubmit = async (values: z.infer<typeof nameFormSchema>) => {
    try {
      const response = await fetch(
        `/api/${params.storeId}/categories/${params.categoryId}`,
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
        `🎉 ${category.name} category for the ${store.name} store updated successfully.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  const onBillboardIdSubmit = async (
    values: z.infer<typeof billboardIdFormSchema>,
  ) => {
    try {
      const response = await fetch(
        `/api/${params.storeId}/categories/${params.categoryId}`,
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
        `🎉 ${category.name} category for the ${store.name} store updated successfully.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <div className={cn("grid gap-6", "lg:grid-cols-2")}>
      <Card className="h-max">
        <CardHeader>
          <CardTitle>Category Name</CardTitle>
          <CardDescription>
            Used to identify your category within its store.
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
            onClick={nameForm.handleSubmit(onNameSubmit)}
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
      <Card className="h-max">
        <CardHeader>
          <CardTitle>Billboard ID</CardTitle>
          <CardDescription>
            Used to identify the billboard for this category within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...billboardIdForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={billboardIdForm.control}
                  name="billboardId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        disabled={billboardIdForm.formState.isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a billboard ID to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {billboards.map((billboard, index) => (
                            <SelectItem key={index} value={billboard.id}>
                              {billboard.label}
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
            disabled={billboardIdForm.formState.isSubmitting}
            onClick={billboardIdForm.handleSubmit(onBillboardIdSubmit)}
          >
            {billboardIdForm.formState.isSubmitting ? (
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
