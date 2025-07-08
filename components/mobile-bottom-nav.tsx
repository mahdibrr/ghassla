"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, ShoppingBag, User, Settings, CreditCard } from "lucide-react"

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Accueil",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      label: "Commandes",
      href: "/dashboard/commandes",
      icon: ShoppingBag,
      active: pathname.includes("/dashboard/commandes"),
    },
    {
      label: "Abonnement",
      href: "/dashboard/subscription",
      icon: CreditCard,
      active: pathname.includes("/dashboard/subscription") || pathname.includes("/dashboard/abonnement"),
    },
    {
      label: "Profil",
      href: "/dashboard/profile",
      icon: User,
      active: pathname.includes("/dashboard/profile"),
    },
    {
      label: "Paramètres",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.includes("/dashboard/settings") || pathname.includes("/dashboard/parametres"),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-2 text-xs transition-colors",
              item.active ? "text-[#0890F1] font-medium" : "text-gray-500 hover:text-[#0890F1]",
            )}
          >
            <div className="relative">
              <item.icon className={cn("h-5 w-5 mb-1", item.active ? "text-[#0890F1]" : "text-gray-500")} />
              {item.active && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#0890F1] rounded-full" />}
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
