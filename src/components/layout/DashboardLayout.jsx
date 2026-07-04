import * as React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./TopNav"
import { cn } from "@/utils/formatters"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar className="w-full" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <React.Suspense fallback={
              <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-pulse rounded-md bg-muted h-32 w-full max-w-md"></div>
              </div>
            }>
              <Outlet />
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
