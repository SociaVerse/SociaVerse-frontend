"use client"

import { useParams } from "next/navigation"

export default function CommunityOverviewPage() {
    const params = useParams()
    const slug = params.slug

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl mb-6 flex items-center justify-center">
                <span className="text-4xl">👋</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to the Community!</h1>
            <p className="text-slate-400 max-w-md mb-8">
                Select a channel from the sidebar to start chatting, or check out the events tab for upcoming activities.
            </p>
        </div>
    )
}
