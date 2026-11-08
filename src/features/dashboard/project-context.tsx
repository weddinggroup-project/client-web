"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Invitation, User } from "@/lib/vowly/types";

type ProjectContextValue = {
  project: Invitation;
  user: User;
  /** Days until the event (WIB calendar days), or null when the dashboard is still locked. */
  daysUntil: number | null;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ value, children }: { value: ProjectContextValue; children: ReactNode }) {
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const value = useContext(ProjectContext);
  if (!value) throw new Error("useProject must be used inside a project dashboard route");
  return value;
}

/** Path of an API resource under the current project, e.g. `projectApi("/guests")`. */
export function useProjectApi() {
  const { project } = useProject();
  return (suffix: string) => `/invitations/${project.id}${suffix}`;
}

/** Like `useProjectApi` but returns null outside a project route (used by tables that are also shown in the admin area). */
export function useOptionalProjectApi(): ((suffix: string) => string) | null {
  const value = useContext(ProjectContext);
  return value ? (suffix: string) => `/invitations/${value.project.id}${suffix}` : null;
}
