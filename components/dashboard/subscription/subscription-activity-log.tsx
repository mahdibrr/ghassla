"use client"

import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CreditCard, Clock, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface SubscriptionActivityLogProps {
  usageData: any[]
  isLoading: boolean
  error: string | null
  detailed?: boolean
}

export default function SubscriptionActivityLog({
  usageData,
  isLoading,
  error,
  detailed = false,
}: SubscriptionActivityLogProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner size={24} className="text-[#0890F1]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-red-50 rounded-lg p-6">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline">Réessayer</Button>
      </div>
    )
  }

  if (usageData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg p-6">
        <Clock className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 mb-4">Aucune activité récente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {usageData.map((activity, index) => (
        <div
          key={activity.id || index}
          className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-[#0890F1]" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">
                  {activity.description || `Utilisation de ${activity.credits_used} crédits`}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(activity.created_at))}</p>
              </div>
              <span className="text-sm font-medium text-[#0890F1]">{activity.credits_used} crédits</span>
            </div>
            {detailed && activity.metadata && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                <pre className="whitespace-pre-wrap">{JSON.stringify(activity.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      ))}

      {usageData.length > 0 && usageData[0].id?.startsWith("mock-") && (
        <div className="text-center text-xs text-gray-400 mt-4 p-2 bg-gray-50 rounded-lg">
          Données d'exemple affichées. Les données réelles seront disponibles une fois que vous aurez utilisé votre
          abonnement.
        </div>
      )}
    </div>
  )
}
