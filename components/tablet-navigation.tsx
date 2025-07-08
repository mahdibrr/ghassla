"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, ShoppingBag, User, Settings, CreditCard, Tag } from "lucide-react"

export default function TabletNavigation() {
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
      label: "Services",
      href: "/prix-et-services",
      icon: Tag,
      active: pathname.includes("/prix-et-services"),
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
    <div className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around w-full h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-2 rounded-md transition-colors",
              item.active
                ? "text-[#0890F1] bg-blue-50 font-medium"
                : "text-gray-600 hover:text-[#0890F1] hover:bg-blue-50/50",
            )}
          >
            <item.icon className={cn("h-5 w-5 mb-1", item.active ? "text-[#0890F1]" : "text-gray-500")} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
