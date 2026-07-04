import * as React from "react"
import { cn } from "@/utils/formatters"
import { Search } from "lucide-react"

const SearchInput = React.forwardRef(({ className, wrapperClassName, ...props }, ref) => {
  return (
    <div className={cn("relative flex items-center", wrapperClassName)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }
