'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on the main dashboard page
  if (pathname === '/dashboard') {
    return null
  }

  const pathSegments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const breadcrumbs: Array<{ name: string; href?: string; icon?: any }> = [
    { name: 'Dashboard', href: '/dashboard', icon: Home }
  ]

  // Add path segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1

    // Convert segment to readable name
    let name = segment.charAt(0).toUpperCase() + segment.slice(1)
    if (segment === 'dashboard') return // Skip dashboard as it's already in the base

    breadcrumbs.push({
      name,
      href: isLast ? '' : currentPath,
    })
  })

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href || breadcrumb.name} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {breadcrumb.href ? (
              <Link
                href={breadcrumb.href}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4 mr-1" />}
                {breadcrumb.name}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {breadcrumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}