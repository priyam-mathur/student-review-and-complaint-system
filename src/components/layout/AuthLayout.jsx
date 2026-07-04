import * as React from "react"
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Content */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] lg:px-16 xl:px-24 bg-card relative z-10">
        <div className="mx-auto w-full max-w-sm">
          <React.Suspense fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          }>
            <Outlet />
          </React.Suspense>
        </div>
      </div>
      
      {/* Right side - Visual/Hero */}
      <div className="hidden lg:block relative w-full flex-1 bg-muted">
        <div className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-primary/80 to-indigo-900/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
          <div className="max-w-xl text-center space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Student Review & Complaint System
            </h2>
            <p className="text-lg leading-8 text-primary-50">
              A modern, transparent, and efficient way to raise concerns, track progress, and communicate with university administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
