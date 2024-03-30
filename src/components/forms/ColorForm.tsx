"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
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

import { cn } from "@/lib/utils";

interface ColorFormProps {
  color: Color;
}

const nameFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Color name must be at least 1 characters.",
    })
    .max(20, {
      message: "Color name must be at most 20 characters.",
    }),
});

const valueFormSchema = z.object({
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

export default function ColorForm({ color }: ColorFormProps) {
  const params = useParams();
  const router = useRouter();

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: color.name,
    },
  });

  const valueForm = useForm<z.infer<typeof valueFormSchema>>({
    resolver: zodResolver(valueFormSchema),
    defaultValues: {
      value: color.value,
    },
  });

  const onNameSubmit = async (values: z.infer<typeof nameFormSchema>) => {
    try {
      const response = await fetch(
        `/api/${params.storeId}/colors/${params.colorId}`,
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
        `🎉 ${color.name} color for the ${store.name} store updated successfully.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  const onValueSubmit = async (values: z.infer<typeof valueFormSchema>) => {
    console.log(values);
    try {
      const response = await fetch(
        `/api/${params.storeId}/colors/${params.colorId}`,
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
        `🎉 ${color.name} color for the ${store.name} store updated successfully.`,
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
          <CardTitle>Color Name</CardTitle>
          <CardDescription>
            Used to identify your color within its store.
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
          <CardTitle>Color Value</CardTitle>
          <CardDescription>
            Used to identify the color for this color within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...valueForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={valueForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Input
                            disabled={valueForm.formState.isSubmitting}
                            placeholder="Value"
                            {...field}
                          />
                          <div
                            className="rounded-full border p-4 shadow"
                            style={{ backgroundColor: field.value }}
                          ></div>
                        </div>
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
            disabled={valueForm.formState.isSubmitting}
            onClick={valueForm.handleSubmit(onValueSubmit)}
          >
            {valueForm.formState.isSubmitting ? (
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
