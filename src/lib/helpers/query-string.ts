type QueryValue = string | number | boolean | null | undefined;

export function createQueryString(
  params: Record<string, QueryValue | QueryValue[]>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item !== null && item !== undefined && item !== "") {
        searchParams.append(key, String(item));
      }
    }
  }

  return searchParams.toString();
}
