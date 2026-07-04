import * as React from "react"
import { cn, getInitials } from "@/utils/formatters"

const Avatar = React.forwardRef(({ className, src, alt, fallback, size = "md", ...props }, ref) => {
  const [imageError, setImageError] = React.useState(false)

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
          {getInitials(fallback || alt || '?')}
        </div>
      )}
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar }
