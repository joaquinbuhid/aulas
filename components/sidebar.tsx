"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, DoorOpen, Clock, Users, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/edificios", label: "Edificios", icon: Building2 },
  { href: "/aulas", label: "Aulas", icon: DoorOpen },
  { href: "/movimientos", label: "Movimientos", icon: Clock },
  { href: "/encargados", label: "Encargados", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Gestión de Aulas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Panel de administración</p>
      </div>
      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
