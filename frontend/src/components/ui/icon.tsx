import * as React from "react"
import { cn } from "@/lib/utils"

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string
  size?: number | string
  className?: string
}

// Simple icon system using emoji/unicode characters
const iconMap: Record<string, string> = {
  // Navigation & UI
  home: "🏠",
  dashboard: "📊",
  settings: "⚙️",
  user: "👤",
  users: "👥",
  profile: "👤",
  menu: "☰",
  close: "✕",
  search: "🔍",
  filter: "🔽",
  sort: "↕️",

  // Real Estate
  building: "🏢",
  house: "🏠",
  apartment: "🏘️",
  office: "🏢",
  property: "🏠",
  location: "📍",
  map: "🗺️",
  image: "🖼️",
  camera: "📷",
  video: "📹",

  // Actions
  edit: "✏️",
  delete: "🗑️",
  add: "➕",
  remove: "➖",
  save: "💾",
  upload: "⬆️",
  download: "⬇️",
  share: "📤",
  export: "📤",
  import: "📥",

  // Status
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  loading: "⏳",
  check: "✓",
  cross: "✕",

  // Business
  money: "💰",
  credit: "💳",
  chart: "📈",
  analytics: "📊",
  report: "📋",
  template: "📄",
  document: "📄",
  folder: "📁",

  // Communication
  email: "✉️",
  message: "💬",
  phone: "📞",
  whatsapp: "💬",
  notification: "🔔",
  bell: "🔔",

  // Media
  photo: "📸",
  gallery: "🖼️",
  play: "▶️",
  pause: "⏸️",
  stop: "⏹️",

  // Navigation
  arrowLeft: "←",
  arrowRight: "→",
  arrowUp: "↑",
  arrowDown: "↓",
  chevronLeft: "‹",
  chevronRight: "›",
  chevronUp: "˄",
  chevronDown: "˅",

  // Theme
  sun: "☀️",
  moon: "🌙",
  light: "💡",
  dark: "🌙",

  // Social
  facebook: "📘",
  twitter: "🐦",
  instagram: "📷",
  linkedin: "💼",
  youtube: "📺",
  tiktok: "🎵",
}

export function Icon({ name, size = 16, className, ...props }: IconProps) {
  const icon = iconMap[name] || "❓"

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        fontSize: typeof size === "number" ? `${size}px` : size,
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
      }}
      {...props}
    >
      {icon}
    </span>
  )
}

// Convenience components for common icons
export function HomeIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="home" {...props} />
}

export function UserIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="user" {...props} />
}

export function SettingsIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="settings" {...props} />
}

export function SearchIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="search" {...props} />
}

export function MenuIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="menu" {...props} />
}

export function CloseIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="close" {...props} />
}

export function EditIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="edit" {...props} />
}

export function DeleteIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="delete" {...props} />
}

export function AddIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="add" {...props} />
}

export function SaveIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="save" {...props} />
}

export function SuccessIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="success" {...props} />
}

export function ErrorIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="error" {...props} />
}

export function WarningIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="warning" {...props} />
}

export function InfoIcon(props: Omit<IconProps, 'name'>) {
  return <Icon name="info" {...props} />
}