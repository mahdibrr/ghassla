"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Calendar, CreditCard, TrendingUp, Clock, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function SubscriptionAnalytics() {
  // Replace with props or fetch from your REST API
  const [subscription, setSubscription] = useState<any | null>({
    credits_used: 12,
    total_credits: 30,
    next_payment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    plan_name: "Premium",
    price: 49.99,
    currency: "DT",
  })
  const [usageData, setUsageData] = useState<any[]>([
    { date: new Date().toISOString(), credits_used: 2 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), credits_used: 3 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), credits_used: 7 },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

  // Remove supabase and use mock data or fetch from your REST API here
  useEffect(() => {
    // Example: fetch from REST API if needed
    // setIsLoading(true)
    // fetch('/api/your-endpoint').then(...)
    // setIsLoading(false)
  }, [timeframe])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size={24} className="text-[#0890F1]" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytiques d'abonnement</CardTitle>
          <CardDescription>Suivez l'utilisation de votre abonnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytiques d'abonnement</CardTitle>
          <CardDescription>Aucun abonnement actif</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <CreditCard className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-4">
              Vous n'avez pas d'abonnement actif. Abonnez-vous pour accéder aux analytiques.
            </p>
            <Button className="bg-[#0890F1] hover:bg-[#0780d8]">Voir les abonnements</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate usage percentage
  const usagePercentage = Math.round((subscription.credits_used / subscription.total_credits) * 100)

  // Calculate days until next payment
  const daysUntilPayment = Math.ceil(
    (new Date(subscription.next_payment_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Analytiques d'abonnement</CardTitle>
            <CardDescription>Suivez l'utilisation de votre abonnement {subscription.plan_name}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={timeframe === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("week")}
              className={timeframe === "week" ? "bg-[#0890F1]" : ""}
            >
              Semaine
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("month")}
              className={timeframe === "month" ? "bg-[#0890F1]" : ""}
            >
              Mois
            </Button>
            <Button
              variant={timeframe === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("year")}
              className={timeframe === "year" ? "bg-[#0890F1]" : ""}
            >
              Année
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Crédits utilisés</span>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold">{subscription.credits_used}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {subscription.total_credits}</span>
                </div>
                <Progress value={usagePercentage} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Prochaine facturation</span>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-[#0890F1] mr-2" />
                  <span className="text-lg font-medium">{formatDate(new Date(subscription.next_payment_date))}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {daysUntilPayment > 0 ? `Dans ${daysUntilPayment} jours` : "Aujourd'hui"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Montant mensuel</span>
                <div className="flex items-center mt-1">
                  <CreditCard className="h-4 w-4 text-[#0890F1] mr-2" />
                  <span className="text-lg font-medium">
                    {subscription.price} {subscription.currency}
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {(subscription.price / subscription.total_credits).toFixed(2)} {subscription.currency} par crédit
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Utilisation des crédits</CardTitle>
            <CardDescription>Historique d'utilisation de vos crédits</CardDescription>
          </CardHeader>
          <CardContent>
            {usageData.length > 0 ? (
              <div className="h-64 relative">
                {/* Simple bar chart visualization */}
                <div className="absolute inset-0 flex items-end justify-around">
                  {usageData.map((data, index) => {
                    const height = (data.credits_used / subscription.total_credits) * 100
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-8 bg-[#0890F1] rounded-t-sm transition-all duration-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-500">
                          {new Date(data.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 25, 50, 75, 100].map((tick) => (
                    <div key={tick} className="w-full h-px bg-gray-200 relative">
                      <span className="absolute -left-6 -top-2 text-xs text-gray-400">{tick}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune donnée d'utilisation disponible</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Activité récente</CardTitle>
            <CardDescription>Dernières utilisations de vos crédits</CardDescription>
          </CardHeader>
          <CardContent>
            {usageData.length > 0 ? (
              <div className="space-y-4">
                {usageData
                  .slice(-3)
                  .reverse()
                  .map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#0890F1] mr-3" />
                        <div>
                          <p className="font-medium text-sm">Utilisation de {data.credits_used} crédits</p>
                          <p className="text-xs text-gray-500">{formatDate(new Date(data.date))}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{data.credits_used} crédits</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Historique complet</Button>
        <Button className="bg-[#0890F1] hover:bg-[#0780d8]">Gérer l'abonnement</Button>
      </CardFooter>
    </Card>
  )
}
