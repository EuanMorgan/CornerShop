import {z} from 'zod';

export const storeSettingsSchema = z.object({
  name: z.string().min(1),
});

export type StoreSettings = z.infer<typeof storeSettingsSchema>;
