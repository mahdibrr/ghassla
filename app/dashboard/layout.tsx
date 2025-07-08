'use client'

import Navbar from "@/components/navbar"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import TabletNavigation from "@/components/tablet-navigation"
import type React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-20 lg:pb-8 mt-0 bg-white rounded-lg shadow-sm">
        {children}
      </main>
      <TabletNavigation />
      <MobileBottomNav />
    </div>
  )
}
