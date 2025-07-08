"use client"

import { Progress } from "@/components/ui/progress"
import { Calendar, CreditCard, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface SubscriptionCreditSummaryProps {
  subscription: any
}

export default function SubscriptionCreditSummary({ subscription }: SubscriptionCreditSummaryProps) {
  if (!subscription) return null

  // Calculate days until next payment
  const nextPaymentDate = new Date(subscription.next_payment_date)
  const today = new Date()
  const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate credits used percentage
  const creditsUsedPercentage = Math.round((subscription.credits_used / subscription.total_credits) * 100)

  // Calculate credits remaining
  const creditsRemaining = subscription.total_credits - subscription.credits_used

  // Calculate days since subscription start
  const startDate = new Date(subscription.start_date)
  const daysSinceStart = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate average daily usage
  const avgDailyUsage = daysSinceStart > 0 ? (subscription.credits_used / daysSinceStart).toFixed(1) : 0

  // Estimate days until credits run out
  const daysUntilEmpty =
    creditsRemaining > 0 && Number(avgDailyUsage) > 0
      ? Math.ceil(creditsRemaining / Number.parseFloat(avgDailyUsage as string))
      : daysUntilPayment

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Crédits utilisés</h3>
        <div className="flex justify-between mb-2">
          <span className="font-medium">
            {subscription.credits_used} / {subscription.total_credits}
          </span>
          <span className="text-gray-500">{creditsUsedPercentage}%</span>
        </div>
        <Progress value={creditsUsedPercentage} className="h-2" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-[#0890F1]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Prochaine facturation</p>
            <p className="font-medium">{formatDate(nextPaymentDate)}</p>
            <p className="text-xs text-gray-500">
              {daysUntilPayment > 0 ? `Dans ${daysUntilPayment} jours` : "Aujourd'hui"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-[#0890F1]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Montant mensuel</p>
            <p className="font-medium">
              {subscription.price} {subscription.currency}
            </p>
            <p className="text-xs text-gray-500">
              {(subscription.price / subscription.total_credits).toFixed(2)} {subscription.currency} par crédit
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <Clock className="h-5 w-5 text-[#0890F1]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimation d'épuisement</p>
            <p className="font-medium">
              {daysUntilEmpty > daysUntilPayment
                ? "Crédits suffisants jusqu'au renouvellement"
                : `Dans environ ${daysUntilEmpty} jours`}
            </p>
            <p className="text-xs text-gray-500">Utilisation moyenne: {avgDailyUsage} crédits/jour</p>
          </div>
        </div>
      </div>
    </div>
  )
}
