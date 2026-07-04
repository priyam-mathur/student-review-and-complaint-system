import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/utils/formatters"
import { useAuth } from "@/contexts/AuthContext"
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  FolderTree,
  Tags
} from "lucide-react"

const Sidebar = ({ className }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const studentLinks = [
    { name: "Dashboard", href: "/student", icon: LayoutDashboard },
    { name: "My Complaints", href: "/student/complaints", icon: FileText },
    { name: "Submit Complaint", href: "/student/submit", icon: FileText },
    { name: "Messages", href: "/student/messages", icon: MessageSquare },
  ]
  
  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Complaints", href: "/admin/complaints", icon: FileText },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Departments", href: "/admin/departments", icon: FolderTree },
    { name: "Categories", href: "/admin/categories", icon: Tags },
  ]
  
  const links = user?.role === 'student' ? studentLinks : adminLinks
  const profileLink = user?.role === 'student' ? '/student/profile' : '/admin/profile'

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      <div className="flex h-16 items-center px-6 border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center">
            S
          </div>
          SRCS Portal
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="space-y-1">
          <Link
            to={profileLink}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export { Sidebar }
