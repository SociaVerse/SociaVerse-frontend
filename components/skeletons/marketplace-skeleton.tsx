import { Skeleton } from "@/components/ui/skeleton"

export function MarketplaceSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px] bg-slate-800" />
                    <Skeleton className="h-4 w-[300px] bg-slate-800" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-full bg-slate-800" />
                    <Skeleton className="h-10 w-24 rounded-full bg-slate-800" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <Skeleton className="h-[180px] w-full rounded-lg bg-slate-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[80%] bg-slate-800" />
                            <Skeleton className="h-4 w-[50%] bg-slate-800" />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-4 w-16 bg-slate-800" />
                            <Skeleton className="h-8 w-8 rounded-full bg-slate-800" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
