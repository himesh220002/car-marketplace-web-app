import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCarItem() {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden h-full">
            <div className="h-[180px] w-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                </div>
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        </div>
    )
}
