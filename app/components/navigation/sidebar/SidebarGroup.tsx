"use client"

import { SidebarItem } from "./SidebarItem"

type Item = {
  title: string
  href: string
  icon?: React.ElementType
}

type Props = {
  label: string
  items: Item[]
}

export function SidebarGroup({ label, items }: Props) {
  return (
    <div className="space-y-1">
      {/* Group label */}
      <div className="px-3 text-xs font-semibold text-muted-foreground uppercase">
        {label}
      </div>

      {/* Group items */}
      {items.map((item) => (
        <SidebarItem key={item.title} item={item} />
      ))}
    </div>
  )
}