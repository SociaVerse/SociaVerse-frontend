import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-[200px] bg-slate-800" />
                <Skeleton className="h-4 w-[300px] bg-slate-800" />
            </div>

            {/* Content Skeleton - mimicking a feed or grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px] bg-slate-800" />
                                    <Skeleton className="h-3 w-[100px] bg-slate-800" />
                                </div>
                            </div>
                            <Skeleton className="h-[200px] w-full rounded-xl bg-slate-800" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[90%] bg-slate-800" />
                                <Skeleton className="h-4 w-[80%] bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Skeleton */}
                <div className="hidden md:block space-y-6">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
                        <Skeleton className="h-6 w-[120px] bg-slate-800" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                                    <Skeleton className="h-4 w-[100px] bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
