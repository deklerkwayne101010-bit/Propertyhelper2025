"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface PublicLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

function PublicLayoutContent({ children, header, footer, className }: PublicLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-foreground">RealEstate Pro</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {header}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="border-t bg-muted/50">
          <div className="container px-4 py-8">
            {footer}
          </div>
        </footer>
      )}
    </div>
  )
}

export function PublicLayout(props: PublicLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="realestate-ui-theme">
      <PublicLayoutContent {...props} />
    </ThemeProvider>
  )
}