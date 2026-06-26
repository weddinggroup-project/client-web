import { ERROR_CODE } from "@/config/constants";
import { AppError, isAppError } from "./app-error";

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      code: ERROR_CODE.INTERNAL_ERROR,
      cause: error,
    });
  }

  return new AppError("Terjadi kesalahan yang tidak diketahui.", {
    code: ERROR_CODE.INTERNAL_ERROR,
    details: error,
  });
}
