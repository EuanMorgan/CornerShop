import { z } from "zod";

export const sizeFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
});

export type SizeForm = z.infer<typeof sizeFormSchema>;
