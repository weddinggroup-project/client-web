"use client";

import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Container } from "@/components/ui/container";
import { helpCategories } from "../help-center-data";
import { HelpCategoryCard } from "./help-category-card";

export function HelpSearch() {
  const [query, setQuery] = useState("");

  const filteredCategories = helpCategories.filter((category) => {
    const haystack = `${category.title} ${category.description}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <Container>
      <div className="mx-auto max-w-md">
        <label htmlFor="help-search" className="sr-only">
          Cari pertanyaan
        </label>
        <div className="relative">
          <HiMagnifyingGlass
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari Pertanyaan"
            className="h-11 w-full rounded-full border border-border bg-background pr-4 pl-10 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-secondary"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <HelpCategoryCard key={category.title} {...category} />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Tidak ada topik yang cocok dengan &ldquo;{query}&rdquo;.
        </p>
      )}
    </Container>
  );
}
