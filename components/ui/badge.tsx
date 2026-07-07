import { cn } from "@/lib/utils"

type BadgeProps = {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "success" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        variant === "warning" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        variant === "destructive" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {children}
    </span>
  )
}
