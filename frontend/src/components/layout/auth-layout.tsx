"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

function AuthLayoutContent({ children, title, subtitle, className }: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo/Brand */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">RealEstate Pro</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional real estate platform with AI-powered tools
            </p>
          </div>

          {/* Title and subtitle */}
          {(title || subtitle) && (
            <div className="mt-8 text-center">
              {title && (
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthLayout(props: AuthLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="realestate-ui-theme">
      <AuthLayoutContent {...props} />
    </ThemeProvider>
  )
}