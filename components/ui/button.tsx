import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "crimson"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        // Base variants
                        "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                        "bg-transparent underline-offset-4 hover:underline": variant === "link",

                        // Neo-Brutalist Variants
                        "ink-border bg-crimson text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--border)]": variant === "crimson",
                        "ink-border bg-muted text-foreground hover:bg-card active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--border)]": variant === "outline",
                        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",

                        // Sizes
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8 text-md": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
