"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, toQueryString, type ApiClient } from "@/lib/vowly/client";
import type { PageMeta } from "@/lib/vowly/types";

type Query = Record<string, string | number | boolean | undefined | null>;
type State<T> = { key: string; data?: T; meta?: PageMeta; error?: ApiError };

/**
 * Loads a GET endpoint of the API and keeps it in state. `loading` is true until the response for the *current*
 * key arrives, so switching page or filter never shows the previous key's data as if it were current. `reload`
 * refetches in place (the old data stays visible meanwhile). Pass `enabled: false` to skip the request.
 */
export function useResource<T>(path: string, query?: Query, enabled = true, client: Pick<ApiClient, "get"> = api) {
  const key = `${path}${toQueryString(query)}`;
  const [state, setState] = useState<State<T>>({ key: "" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    client
      .get<T>(path, query, controller.signal)
      .then((response) => setState({ key, data: response.data, meta: response.meta }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ key, error: error instanceof ApiError ? error : new ApiError("Terjadi kesalahan. Coba lagi.", 0) });
      });
    return () => controller.abort();
    // `query` is represented by `key`; including the object would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick, enabled, client]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  const current = state.key === key;
  return {
    data: current ? state.data : undefined,
    meta: current ? state.meta : undefined,
    error: current ? state.error : undefined,
    loading: enabled && !current,
    reload,
  };
}
