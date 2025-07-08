"use client"

import { formatDate } from "@/lib/utils"
import { CreditCard, AlertCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useEffect, useState } from "react"

type Payment = {
  id: string
  date: string
  amount: number
  status: string
}

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    date: "2024-01-15T12:00:00",
    amount: 49.99,
    status: "completed",
  },
  {
    id: "pay-2",
    date: "2024-02-15T12:00:00",
    amount: 49.99,
    status: "completed",
  },
  {
    id: "pay-3",
    date: "2024-03-15T12:00:00",
    amount: 49.99,
    status: "pending",
  },
]

interface SubscriptionPaymentHistoryProps {
  subscription: any
  detailed?: boolean
}

export default function SubscriptionPaymentHistory({ subscription, detailed }: SubscriptionPaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayments() {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate fetching payments from a database
        await new Promise((resolve) => setTimeout(resolve, 500))

        setPayments(mockPayments)
      } catch (error) {
        console.error("Error fetching payments:", error)
        setError("Impossible de charger l'historique des paiements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size={24} className="text-[#0890F1]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 mb-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-[#0890F1] mr-3" />
                <div>
                  <p className="font-medium text-sm">Paiement #{payment.id}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{payment.amount} DT</p>
                <p className="text-xs text-gray-500">{payment.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">Aucun paiement trouvé</p>
        </div>
      )}
    </div>
  )
}
