import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <LoadingSpinner className="justify-start" label="Memuat dashboard…" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-5 w-80 max-w-full" />
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <Skeleton className="h-40" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
