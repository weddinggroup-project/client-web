import { NextResponse } from "next/server";
import type { ApiFailure, ApiMeta, ApiSuccess } from "@/types/api";

export function apiSuccess<T>(data: T, meta?: ApiMeta, status = 200) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };

  return NextResponse.json(body, { status });
}

export function apiFailure(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  const body: ApiFailure = {
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  };

  return NextResponse.json(body, { status });
}
