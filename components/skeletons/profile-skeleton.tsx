import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 animate-pulse">
            {/* Banner */}
            <div className="w-full h-48 md:h-64 bg-slate-800 rounded-b-3xl relative"></div>

            {/* Bio / Stats */}
            <div className="px-4 md:px-8 -mt-16 flex flex-col items-center md:items-start relative z-10">
                <div className="w-32 h-32 rounded-full border-4 border-black bg-slate-700"></div>

                <div className="mt-4 flex flex-col md:flex-row w-full justify-between items-center md:items-end gap-4">
                    <div className="text-center md:text-left space-y-2">
                        <div className="h-6 w-48 bg-slate-800 rounded mx-auto md:mx-0"></div>
                        <div className="h-4 w-32 bg-slate-800 rounded mx-auto md:mx-0"></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-10 w-24 bg-slate-800 rounded-full"></div>
                        <div className="h-10 w-24 bg-slate-800 rounded-full"></div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex gap-8 mt-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="h-5 w-8 bg-slate-800 rounded mb-1"></div>
                            <div className="h-3 w-12 bg-slate-800 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-b border-slate-800 flex gap-6 px-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 w-20 bg-slate-800 rounded-t mb-2"></div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 md:gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-square bg-slate-800 rounded-md"></div>
                ))}
            </div>
        </div>
    )
}
