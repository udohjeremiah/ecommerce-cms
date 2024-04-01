"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { LoaderCircleIcon } from "lucide-react";
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

interface SettingsFormProps {
  store: Store;
}

const storeNameFormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "Store name must be at least 4 characters.",
    })
    .max(20, {
      message: "Store name must be at most 20 characters.",
    }),
});

export default function SettingsForm({ store }: SettingsFormProps) {
  const params = useParams();
  const router = useRouter();

  const storeNameForm = useForm<z.infer<typeof storeNameFormSchema>>({
    resolver: zodResolver(storeNameFormSchema),
    defaultValues: {
      name: store.name,
    },
  });

  const onSubmit = async <T extends ZodType<any, any, any>>(
    values: z.infer<T>,
  ) => {
    try {
      const response = await fetch(`/api/stores/${params.storeId}`, {
        method: "PATCH",
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
      router.refresh();
      toast.success(`🎉 ${store.name} store updated successfully.`);
    } catch (error) {
      console.error(error);
      toast.error("💔 Something went wrong.");
    }
  };

  return (
    <div className={cn("grid gap-6", "lg:grid-cols-2")}>
      <Card>
        <CardHeader>
          <CardTitle>Store Name</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...storeNameForm}>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={storeNameForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={storeNameForm.formState.isSubmitting}
                          placeholder="Store Name"
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
            disabled={storeNameForm.formState.isSubmitting}
            onClick={storeNameForm.handleSubmit(
              onSubmit<typeof storeNameFormSchema>,
            )}
          >
            {storeNameForm.formState.isSubmitting ? (
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
