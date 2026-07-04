import * as React from "react"
import { cn } from "@/utils/formatters"
import { cva } from "class-variance-authority"

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    // Complaint Statuses
    draft: { label: "Draft", variant: "secondary" },
    submitted: { label: "Submitted", variant: "default" },
    under_review: { label: "Under Review", variant: "warning" },
    assigned: { label: "Assigned", variant: "primary" },
    in_progress: { label: "In Progress", variant: "warning" },
    waiting_student: { label: "Waiting on Student", variant: "warning" },
    resolved: { label: "Resolved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
    closed: { label: "Closed", variant: "secondary" },
    
    // Priorities
    low: { label: "Low", variant: "secondary" },
    medium: { label: "Medium", variant: "warning" },
    high: { label: "High", variant: "destructive" },
    urgent: { label: "Urgent", variant: "destructive" },
  }

  const config = statusConfig[status] || { label: status, variant: "secondary" }

  const variants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    {
      variants: {
        variant: {
          default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400",
          success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          primary: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
        }
      }
    }
  )

  return (
    <span className={cn(variants({ variant: config.variant }), className)}>
      {config.label}
    </span>
  )
}

export { StatusBadge }
