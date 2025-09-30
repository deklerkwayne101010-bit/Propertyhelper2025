"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"

interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

interface SidebarNavProps {
  items: NavItem[]
  className?: string
}

export function SidebarNav({ items, className }: SidebarNavProps) {
  const [openSections, setOpenSections] = React.useState<string[]>([])

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openSections.includes(item.title)

    return (
      <div key={item.title}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-auto p-3 text-left font-normal",
            level > 0 && "pl-6"
          )}
          onClick={() => hasChildren ? toggleSection(item.title) : undefined}
        >
          <div className="flex items-center space-x-3 w-full">
            {item.icon && (
              <Icon
                name={item.icon}
                size={18}
                className="flex-shrink-0"
              />
            )}
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <Icon
                name={isOpen ? "chevronDown" : "chevronRight"}
                size={14}
                className="flex-shrink-0"
              />
            )}
          </div>
        </Button>

        {hasChildren && isOpen && (
          <div className="ml-4 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className={cn("space-y-1", className)}>
      {items.map(item => renderNavItem(item))}
    </nav>
  )
}

// Predefined navigation items for the real estate platform
export const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Properties",
    href: "/properties",
    icon: "building",
    children: [
      { title: "All Properties", href: "/properties", icon: "building" },
      { title: "Add Property", href: "/properties/add", icon: "add" },
      { title: "Property Listings", href: "/properties/listings", icon: "document" },
    ],
  },
  {
    title: "Templates",
    href: "/templates",
    icon: "template",
    children: [
      { title: "My Templates", href: "/templates", icon: "folder" },
      { title: "Create Template", href: "/templates/create", icon: "add" },
      { title: "Template Marketplace", href: "/templates/marketplace", icon: "document" },
    ],
  },
  {
    title: "CRM",
    href: "/crm",
    icon: "users",
    children: [
      { title: "Contacts", href: "/crm/contacts", icon: "user" },
      { title: "Leads", href: "/crm/leads", icon: "user" },
      { title: "Deals", href: "/crm/deals", icon: "money" },
    ],
  },
  {
    title: "Media",
    href: "/media",
    icon: "image",
    children: [
      { title: "Photo Enhancement", href: "/media/enhancement", icon: "photo" },
      { title: "Video Creation", href: "/media/videos", icon: "video" },
      { title: "Asset Library", href: "/media/assets", icon: "gallery" },
    ],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: "chart",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
    children: [
      { title: "Account", href: "/settings/account", icon: "user" },
      { title: "Billing", href: "/settings/billing", icon: "credit" },
      { title: "Integrations", href: "/settings/integrations", icon: "settings" },
    ],
  },
]