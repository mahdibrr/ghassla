"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import ProfileForm from "@/components/dashboard/profile/profile-form"
import SecurityForm from "@/components/dashboard/profile/security-form"
import NotificationPreferences from "@/components/dashboard/profile/notification-preferences"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} className="text-[#0890F1]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="h-12 bg-transparent border-b-0 p-0 px-6">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#0890F1] data-[state=active]:text-[#0890F1] data-[state=active]:shadow-none rounded-none h-12 px-4"
                >
                  Informations personnelles
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#0890F1] data-[state=active]:text-[#0890F1] data-[state=active]:shadow-none rounded-none h-12 px-4"
                >
                  Sécurité
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#0890F1] data-[state=active]:text-[#0890F1] data-[state=active]:shadow-none rounded-none h-12 px-4"
                >
                  Notifications
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="mt-0 p-6">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="security" className="mt-0 p-6">
              <SecurityForm />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 p-6">
              <NotificationPreferences />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
