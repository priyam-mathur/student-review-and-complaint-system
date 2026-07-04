import * as React from "react"
import { cn } from "@/utils/formatters"
import { X } from "lucide-react"

const Modal = ({ isOpen, onClose, title, description, children, className }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "z-50 w-full max-w-lg scale-100 gap-4 border bg-card p-6 shadow-lg sm:rounded-lg animate-slide-up",
        className
      )}>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Modal }
