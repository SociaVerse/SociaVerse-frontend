import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ChatSkeleton() {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative custom-scrollbar">
            {/* Header Placeholder */}
            <div className="flex justify-center mb-8 mt-4">
                <Skeleton className="h-8 w-64 rounded-xl bg-slate-800/50" />
            </div>

            {/* Message Skeletons */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className={cn(
                        "flex w-full items-end gap-2",
                        i % 2 === 0 ? "justify-end" : "justify-start"
                    )}
                >
                    {i % 2 !== 0 && <Skeleton className="w-8 h-8 rounded-full bg-slate-800/50 mb-1" />}
                    <div className={cn(
                        "space-y-2 max-w-[60%]",
                        i % 2 === 0 ? "items-end flex flex-col" : "items-start"
                    )}>
                        <Skeleton
                            className={cn(
                                "h-12 rounded-2xl bg-slate-800/50",
                                i % 2 === 0 ? "w-48 rounded-tr-sm" : "w-64 rounded-tl-sm"
                            )}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
