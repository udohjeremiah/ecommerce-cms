"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
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

interface BillboardFormProps {
  billboard: Billboard;
}

const labelFormSchema = z.object({
  label: z
    .string()
    .min(4, {
      message: "Billboard label must be at least 4 characters.",
    })
    .max(60, {
      message: "Billboard label must be at most 60 characters.",
    }),
});

const imageFormSchema = z.object({
  imagePublicId: z.string().min(1, {
    message: "Billboard must have a background image.",
  }),
});

export default function BillboardForm({ billboard }: BillboardFormProps) {
  const [imagePublicId, setImagePublicId] = useState(billboard.imagePublicId);

  const params = useParams();
  const router = useRouter();

  const labelForm = useForm<z.infer<typeof labelFormSchema>>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: {
      label: billboard.label,
    },
  });

  const imageForm = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      imagePublicId: billboard.imagePublicId,
    },
  });

  const { user } = useUser();

  useEffect(() => {
    imageForm.setValue("imagePublicId", imagePublicId);
  }, [imageForm, imagePublicId]);

  const onSubmit = async <T extends ZodType<any, any, any>>(
    values: z.infer<T>,
  ) => {
    try {
      const response = await fetch(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
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
        `🎉 Billboard for the ${store.name} store updated successfully.`,
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
          <CardTitle>Label</CardTitle>
          <CardDescription>
            Used to identify your billboard within its store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...labelForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={labelForm.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={labelForm.formState.isSubmitting}
                          placeholder="Label"
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
            disabled={labelForm.formState.isSubmitting}
            onClick={labelForm.handleSubmit(onSubmit<typeof labelFormSchema>)}
          >
            {labelForm.formState.isSubmitting ? (
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
          <CardTitle>Background Image</CardTitle>
          <CardDescription>
            The background image shown on your billboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CldImage
            src={imagePublicId}
            alt=""
            width="200"
            height="200"
            priority
          />
        </CardContent>
        <CardFooter className="space-x-4 border-t px-6 py-4">
          {user?.id && (
            <Button
              asChild
              variant="secondary"
              type="button"
              disabled={imageForm.formState.isSubmitting}
            >
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ folder: `ecommerce-cms/${user.id}/billboard` }}
                onUploadAdded={() => setImagePublicId("")}
                onSuccess={(results) => {
                  if (typeof results?.info === "object") {
                    setImagePublicId(results.info.public_id);
                  }
                  if (typeof results?.info === "object") {
                    const info = results.info as CloudinaryUploadWidgetInfo;
                    setImagePublicId(info.public_id);
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
            disabled={imageForm.formState.isSubmitting}
            onClick={imageForm.handleSubmit(onSubmit<typeof imageFormSchema>)}
          >
            {imageForm.formState.isSubmitting ? (
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
