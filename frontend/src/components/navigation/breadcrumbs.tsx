"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"

interface BreadcrumbItem {
  title: string
  href?: string
  icon?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: string
  className?: string
}

export function Breadcrumbs({ items, separator = "/", className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={item.title}>
            <div className="flex items-center space-x-1">
              {item.icon && (
                <Icon name={item.icon} size={14} />
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                <span className={cn(
                  "truncate max-w-[150px]",
                  isLast && "text-foreground font-medium"
                )}>
                  {item.title}
                </span>
              )}
            </div>

            {!isLast && (
              <span className="text-muted-foreground select-none">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Hook for generating breadcrumbs from current path
export function useBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/', icon: 'home' }
  ]

  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Convert segment to readable title
    const title = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Map common segments to icons
    const iconMap: Record<string, string> = {
      'dashboard': 'dashboard',
      'properties': 'building',
      'templates': 'template',
      'crm': 'users',
      'media': 'image',
      'analytics': 'chart',
      'settings': 'settings',
      'profile': 'user',
      'billing': 'credit',
    }

    breadcrumbs.push({
      title,
      href: isLast ? undefined : currentPath,
      icon: iconMap[segment.toLowerCase()]
    })
  })

  return breadcrumbs
}