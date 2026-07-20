import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[100px] w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm shadow-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/20 focus-visible:border-accent-primary/40 focus-visible:shadow-[0_0_20px_rgba(255,59,59,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
