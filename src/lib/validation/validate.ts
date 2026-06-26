import type { z } from "zod";
import { ERROR_CODE, HTTP_STATUS } from "@/config/constants";
import { AppError } from "@/lib/errors/app-error";

export function validate<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new AppError("Data yang dikirim tidak valid.", {
      code: ERROR_CODE.VALIDATION_ERROR,
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details: result.error.flatten(),
    });
  }

  return result.data;
}

export function safeValidate<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
) {
  return schema.safeParse(input);
}
