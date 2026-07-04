import * as React from "react"
import { cn } from "@/utils/formatters"

const Select = React.forwardRef(({ className, error, options = [], placeholder = "Select an option", ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute right-3 top-3">
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {error && (
        <span className="text-xs text-destructive mt-1 block">
          {error}
        </span>
      )}
    </div>
  )
})
Select.displayName = "Select"

export { Select }
