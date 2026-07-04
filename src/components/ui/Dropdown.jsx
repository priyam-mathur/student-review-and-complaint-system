import * as React from "react"
import { cn } from "@/utils/formatters"

const Dropdown = ({ trigger, children, align = "right", className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => setIsOpen(false)} // Close on item click
        >
          <div className="p-1">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

const DropdownItem = ({ children, onClick, className, destructive = false }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      destructive && "text-destructive focus:text-destructive hover:bg-destructive/10 hover:text-destructive",
      className
    )}
  >
    {children}
  </button>
)

const DropdownSeparator = () => (
  <div className="-mx-1 my-1 h-px bg-muted" />
)

export { Dropdown, DropdownItem, DropdownSeparator }
