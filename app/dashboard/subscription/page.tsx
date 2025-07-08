"use client"

import { useEffect, useState } from "react"
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Progress } from "@/components/ui/progress"
import { Check, X, CreditCard, Calendar, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Types for subscription data
type SubscriptionPlan = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: string
  total_credits: number
  features: {
    name: string
    included: boolean
  }[]
  is_active: boolean
}

type UserSubscription = {
  id: string
  plan_id?: string
  metadata?: { plan_id: string }
  plan_name: string
  credits_used: number
  total_credits: number
  price: number
  currency: string
  status: string
  start_date: string
  next_payment_date: string
}

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [plansLoading, setPlansLoading] = useState(true)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingSubscription, setProcessingSubscription] = useState(false)

  // Helper function to check if a subscription matches a plan
  const isSubscribedToPlan = (subscription: UserSubscription | null, planId: string): boolean => {
    if (!subscription) return false
    if (subscription.plan_id === planId) return true
    if (subscription.metadata && subscription.metadata.plan_id === planId) return true
    return false
  }

  // Use mock plans
  useEffect(() => {
    setPlansLoading(true)
    setTimeout(() => {
      setPlans([
        {
          id: "plan-1",
          name: "Big Ghassla",
          description: "Notre forfait premium avec un maximum de services et de crédits pour toutes vos besoins de lessive.",
          price: 299.99,
          currency: "TND",
          interval: "monthly",
          total_credits: 50,
          features: [
            { name: "Lavage illimité", included: true },
            { name: "Repassage premium", included: true },
            { name: "Livraison express", included: true },
            { name: "Traitement des taches", included: true },
            { name: "Service prioritaire", included: true },
          ],
          is_active: true,
        },
        {
          id: "plan-2",
          name: "Ghassla Fa9r",
          description: "Notre forfait économique pour les besoins essentiels de lessive à petit budget.",
          price: 99.99,
          currency: "TND",
          interval: "monthly",
          total_credits: 20,
          features: [
            { name: "Lavage standard", included: true },
            { name: "Repassage basique", included: true },
            { name: "Livraison standard", included: true },
            { name: "Traitement des taches", included: false },
            { name: "Service prioritaire", included: false },
          ],
          is_active: true,
        },
      ])
      setPlansLoading(false)
    }, 400)
  }, [])

  // Use mock user subscription
  useEffect(() => {
    if (!user?.id) return
    setSubscriptionLoading(true)
    setTimeout(() => {
      setUserSubscription({
        id: `mock-sub-${user.id}`,
        plan_id: "plan-1",
        plan_name: "Big Ghassla",
        credits_used: 5,
        total_credits: 50,
        price: 299.99,
        currency: "TND",
        status: "active",
        start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        next_payment_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      })
      setSubscriptionLoading(false)
    }, 400)
  }, [user])

  // Subscribe to a plan (mock)
  const subscribeToPlan = async (planId: string) => {
    if (!user?.id) {
      // Optionally show a message/UI here
      return
    }
    setProcessingSubscription(true)
    setError(null)
    const selectedPlan = plans.find((plan) => plan.id === planId)
    if (!selectedPlan) {
      setError("Plan non trouvé")
      setProcessingSubscription(false)
      return
    }
    setTimeout(() => {
      setUserSubscription({
        id: `mock-sub-${user.id}`,
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        credits_used: 0,
        total_credits: selectedPlan.total_credits,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        status: "active",
        start_date: new Date().toISOString(),
        next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      toast({
        title: "Abonnement créé",
        description: "Votre abonnement a été créé avec succès",
      })
      setProcessingSubscription(false)
    }, 600)
  }

  // Cancel subscription (mock)
  const cancelSubscription = async () => {
    if (!user?.id || !userSubscription) return
    setProcessingSubscription(true)
    setTimeout(() => {
      setUserSubscription(null)
      toast({
        title: "Abonnement annulé",
        description: "Votre abonnement a été annulé avec succès",
      })
      setProcessingSubscription(false)
    }, 600)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={40} className="text-[#0890F1]" />
      </div>
    )
  }

  if (!user) {
    return null // Or show a message/UI
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900">Abonnements</h1>
              <p className="mt-4 text-lg text-gray-600">
                Choisissez le plan qui correspond le mieux à vos besoins de lessive
              </p>
            </div>

            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Current Subscription */}
            {subscriptionLoading ? (
              <div className="mb-12 flex justify-center">
                <LoadingSpinner size={24} className="text-[#0890F1]" />
              </div>
            ) : userSubscription ? (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Votre abonnement actuel</h2>
                <Card className="border-[#0890F1] border-2">
                  <CardHeader className="bg-blue-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">{userSubscription.plan_name}</CardTitle>
                        <CardDescription>{userSubscription.price} DT / mois</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Crédits utilisés</span>
                        <span className="font-medium">
                          {userSubscription.credits_used} / {userSubscription.total_credits}
                        </span>
                      </div>
                      <Progress
                        value={(userSubscription.credits_used / userSubscription.total_credits) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Date de début</span>
                            <span className="text-sm font-medium">{formatDate(new Date(userSubscription.start_date))}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Prochaine facturation</span>
                            <span className="text-sm font-medium">
                              {formatDate(new Date(userSubscription.next_payment_date))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={cancelSubscription}
                      disabled={processingSubscription}
                    >
                      {processingSubscription ? <LoadingSpinner size={16} className="mr-2" /> : null}
                      Annuler l'abonnement
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
