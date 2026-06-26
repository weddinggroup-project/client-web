"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import type { SelectOption } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const LazySelect = dynamic(
  () => import("@/components/ui/select").then((module) => module.Select),
  { loading: () => <Skeleton className="h-11 w-full" />, ssr: false },
);

const LazyDatePicker = dynamic(
  () =>
    import("@/components/ui/date-picker").then((module) => module.DatePicker),
  { loading: () => <Skeleton className="h-11 w-full" />, ssr: false },
);

const categories: SelectOption[] = [
  { label: "SaaS", value: "saas" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "Content platform", value: "content" },
];

export function ComponentsDemo() {
  const t = useTranslations("Components");
  const locale = useLocale() as "id" | "en";
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [date, setDate] = useState<Date>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="project-category">{t("category")}</Label>
        <LazySelect
          inputId="project-category"
          instanceId="project-category"
          options={categories}
          value={category}
          placeholder={t("selectPlaceholder")}
          onChange={(option) => setCategory(option as SelectOption | null)}
        />
      </div>
      <div className="space-y-2">
        <Label>{t("date")}</Label>
        <LazyDatePicker
          value={date}
          locale={locale}
          placeholder={t("datePlaceholder")}
          onChange={setDate}
        />
      </div>
    </div>
  );
}
