import { z } from "zod";

export const healthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    status: z.literal("ok"),
    service: z.string(),
    timestamp: z.iso.datetime(),
  }),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
