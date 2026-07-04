import * as React from "react"
import { Bell, Menu, Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { ThemeToggle } from "../ui/ThemeToggle"
import { Avatar } from "../ui/Avatar"
import { Dropdown, DropdownItem } from "../ui/Dropdown"
import { Badge } from "../ui/Badge"

const TopNav = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Global Search - Visual only for now */}
        <div className="hidden sm:flex items-center rounded-md bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground border">
          <Search className="mr-2 h-4 w-4" />
          <span className="opacity-50">Search (Cmd+K)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <ThemeToggle />
        
        {/* Notifications */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2">
              <Avatar 
                src={user?.avatar} 
                alt={user?.name} 
                size="sm" 
                className="cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all"
              />
            </div>
          }
        >
          <div className="px-2 py-1.5 text-sm">
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
          </div>
          <div className="h-px bg-border my-1" />
          <DropdownItem onClick={() => window.location.href = user?.role === 'student' ? '/student/profile' : '/admin/profile'}>
            Profile Settings
          </DropdownItem>
          <DropdownItem onClick={logout} destructive>
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}

export { TopNav }
