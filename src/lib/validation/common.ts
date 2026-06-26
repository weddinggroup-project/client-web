import { z } from "zod";
import { appConfig } from "@/config/app";

export const idSchema = z.string().trim().min(1, "ID wajib diisi.");

export const emailSchema = z
  .email("Format email tidak valid.")
  .transform((value) => value.toLowerCase());

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(appConfig.pagination.defaultPage),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(appConfig.pagination.maxPageSize)
    .default(appConfig.pagination.defaultPageSize),
});
