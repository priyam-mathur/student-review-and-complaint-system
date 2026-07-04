import * as React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cn } from "@/utils/formatters"

const Breadcrumb = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Breadcrumb }
