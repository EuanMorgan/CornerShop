import { z } from "zod";

export const colorFormSchema = z.object({
  name: z.string().min(1),
  value: z
    .string()
    .min(4)
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Must be a valid hex color"
    })
});

export type ColorForm = z.infer<typeof colorFormSchema>;
