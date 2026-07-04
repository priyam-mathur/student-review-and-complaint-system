import * as React from "react"
import { cn } from "@/utils/formatters"
import { Inbox } from "lucide-react"
import { Button } from "./Button"

const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new entry.", 
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
