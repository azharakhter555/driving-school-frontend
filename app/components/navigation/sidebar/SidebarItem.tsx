// components/navigation/sidebar/SidebarItem.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/config/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  item: NavItem;
  level?: number;
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
};

export function SidebarItem({ 
  item, 
  level = 0, 
  sidebarOpen = true, 
  toggleSidebar 
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  
  // Check if current path matches this item or any of its children
  const isActive = item.href 
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : item.children?.some(child => 
        child.href && (pathname === child.href || pathname.startsWith(child.href + "/"))
      );

  // Auto-expand if a child is active
  if (hasChildren && !open && isActive) {
    setOpen(true);
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sidebarOpen && toggleSidebar) {
      toggleSidebar();
    }
  };

  const toggleChildren = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(!open);
  };

  // For items WITH children (groups)
  if (hasChildren) {
    return (
      <div className="flex flex-col">
        <button
          className={`flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md w-full text-left
            ${open || isActive ? "bg-muted/30" : "hover:bg-muted/50"}
            ${!sidebarOpen ? "justify-center" : ""}`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={toggleChildren}
          title={!sidebarOpen ? item.title : undefined}
          type="button"
        >
          <div className="flex items-center gap-2">
            <div 
              onClick={handleIconClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {item.icon && <item.icon size={18} />}
            </div>
            
            {sidebarOpen && <span>{item.title}</span>}
          </div>
          
          {sidebarOpen && (
            open ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>

        {open && sidebarOpen && (
          <div className="flex flex-col">
            {item.children!.map((child) => (
              <SidebarItem 
                key={child.title} 
                item={child} 
                level={level + 1} 
                sidebarOpen={sidebarOpen}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // For items WITHOUT children (actual navigation links)
  return (
    <Link
      href={item.href || "#"}
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md
        ${isActive ? "bg-muted font-medium" : "hover:bg-muted/50"}
        ${!sidebarOpen ? "justify-center" : ""}`}
      style={{ paddingLeft: `${level * 16 + 12}px` }}
      title={!sidebarOpen ? item.title : undefined}
    >
      <div 
        onClick={handleIconClick}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        {item.icon && <item.icon size={18} />}
      </div>
      
      {sidebarOpen && <span>{item.title}</span>}
    </Link>
  );
}