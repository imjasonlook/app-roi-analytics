import { z } from "zod";

export const RoiQuerySchema = z.object({
  app: z.string().optional(),
  country: z.string().optional(),
  channel: z.string().optional(),
  bidType: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  mode: z.enum(["raw", "ma7"]).default("ma7"),
  scale: z.enum(["linear", "log"]).default("linear"),
  limitDays: z.number().int().positive().max(365).default(90)
});
export type RoiQuery = z.infer<typeof RoiQuerySchema>;
