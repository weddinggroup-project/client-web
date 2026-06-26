import { z } from "zod";
import { appConfig } from "@/config/app";
import { ERROR_CODE } from "@/config/constants";
import { AppError } from "@/lib/errors/app-error";
import { createQueryString } from "@/lib/helpers/query-string";

type QueryValue = string | number | boolean | null | undefined;

export type FetchApiOptions<TSchema extends z.ZodType | undefined = undefined> = Omit<
  RequestInit,
  "body"
> & {
  body?: unknown;
  query?: Record<string, QueryValue | QueryValue[]>;
  timeoutMs?: number;
  retries?: number;
  schema?: TSchema;
  next?: NextFetchRequestConfig;
};

function withQuery(url: string, query?: FetchApiOptions["query"]) {
  if (!query) return url;
  const queryString = createQueryString(query);
  if (!queryString) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
}

function canRetry(method: string, status?: number) {
  if (!["GET", "HEAD"].includes(method)) return false;
  return status === undefined || status === 408 || status === 429 || status >= 500;
}

async function readResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json")
    ? response.json()
    : response.text();
}

export async function fetchApi<
  TData,
  TSchema extends z.ZodType | undefined = undefined,
>(
  url: string,
  options: FetchApiOptions<TSchema> = {},
): Promise<TSchema extends z.ZodType ? z.output<TSchema> : TData> {
  const {
    body,
    headers,
    query,
    signal,
    timeoutMs = appConfig.api.timeoutMs,
    retries = appConfig.api.retries,
    schema,
    ...requestOptions
  } = options;
  const method = (requestOptions.method ?? "GET").toUpperCase();
  const requestUrl = withQuery(url, query);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(requestUrl, {
        ...requestOptions,
        method,
        headers: {
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
          : AbortSignal.timeout(timeoutMs),
      });
      const data = await readResponse(response);

      if (!response.ok) {
        if (attempt < retries && canRetry(method, response.status)) continue;

        const apiMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "object" &&
          data.error !== null &&
          "message" in data.error
            ? String(data.error.message)
            : `Request gagal dengan status ${response.status}.`;

        throw new AppError(apiMessage, {
          code: `HTTP_${response.status}`,
          statusCode: response.status,
          details: data,
        });
      }

      return (schema ? schema.parse(data) : data) as TSchema extends z.ZodType
        ? z.output<TSchema>
        : TData;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof z.ZodError) {
        throw new AppError("Response API tidak sesuai kontrak.", {
          code: ERROR_CODE.VALIDATION_ERROR,
          statusCode: 502,
          details: error.flatten(),
          cause: error,
        });
      }
      if (attempt < retries && canRetry(method)) continue;

      const timedOut =
        error instanceof DOMException &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      throw new AppError(
        timedOut ? "Request melewati batas waktu." : "Tidak dapat terhubung ke server.",
        {
          code: timedOut ? ERROR_CODE.REQUEST_TIMEOUT : ERROR_CODE.NETWORK_ERROR,
          statusCode: timedOut ? 408 : 503,
          cause: error,
        },
      );
    }
  }

  throw new AppError("Request gagal.", { code: ERROR_CODE.NETWORK_ERROR });
}
