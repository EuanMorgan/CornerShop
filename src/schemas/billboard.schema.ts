import { z } from "zod";

export const billboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z
    .string({
      required_error: "Image is required"
    })
    .min(1, "Image is required")
    .url()
});

export type BillboardForm = z.infer<typeof billboardFormSchema>;
