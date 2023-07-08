"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AlertModal } from "~/components/modals/AlertModal";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { SizeForm, sizeFormSchema } from "~/schemas/size.schema";

const SizeForm = ({ initialData }: { initialData: Size | null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<SizeForm>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    }
  });

  const onSubmit = async (values: SizeForm) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/sizes`, values);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/stores/${params.storeId}/sizes/${params.sizeId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Dyanmic text based on if we are creating or editing a size
  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add a new Size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes" : "Create";

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size={"sm"}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
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
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
