"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"

export default function SubscriptionUsageTracker() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [credits, setCredits] = useState<number>(1)
  const [description, setDescription] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usageHistory, setUsageHistory] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch subscription data
  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await fetch("/api/subscriptions/current").then((res) => res.json())

        if (error) {
          console.error("Error fetching subscription:", error)
          setError("Impossible de charger les données d'abonnement")
          return
        }

        setSubscription(data)

        // Fetch usage history
        const { data: usageData, error: usageError } = await fetch("/api/subscriptions/usage-history").then((res) =>
          res.json(),
        )

        if (usageError) {
          console.error("Error fetching usage history:", usageError)
        } else {
          setUsageHistory(usageData || [])
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Une erreur s'est produite")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subscription?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez avoir un abonnement actif",
        variant: "destructive",
      })
      return
    }

    if (credits < 1) {
      toast({
        title: "Erreur",
        description: "Le nombre de crédits doit être supérieur à 0",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/subscriptions/use-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          credits,
          description: description || "Utilisation de crédits",
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Une erreur s'est produite")
      }

      // Update subscription data
      setSubscription({
        ...subscription,
        credits_used: subscription.credits_used + credits,
      })

      // Add to usage history
      setUsageHistory([
        {
          id: `temp-${Date.now()}`,
          subscription_id: subscription.id,
          credits_used: credits,
          description: description || "Utilisation de crédits",
          created_at: new Date().toISOString(),
        },
        ...usageHistory,
      ])

      toast({
        title: "Crédits utilisés",
        description: `${credits} crédits ont été utilisés avec succès. Il vous reste ${result.remainingCredits} crédits.`,
      })

      // Reset form
      setCredits(1)
      setDescription("")
    } catch (err: any) {
      console.error("Error using credits:", err)
      setError(err.message || "Une erreur s'est produite lors de l'utilisation des crédits")
      toast({
        title: "Erreur",
        description: err.message || "Une erreur s'est produite lors de l'utilisation des crédits",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <LoadingSpinner size={24} className="text-[#0890F1]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suivi d'utilisation</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suivi d'utilisation</CardTitle>
          <CardDescription>Aucun abonnement actif</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Vous n'avez pas d'abonnement actif. Abonnez-vous pour accéder au suivi d'utilisation.
            </p>
            <Button className="bg-[#0890F1] hover:bg-[#0780d8]">Voir les abonnements</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate usage percentage
  const usagePercentage = Math.round((subscription.credits_used / subscription.total_credits) * 100)
  const remainingCredits = subscription.total_credits - subscription.credits_used

  return (
    <div>
      {/* Add a visible section at the top to show the current stats for the subscription */}
      <Card className="mb-6 bg-blue-50 border-blue-200 border">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Statistiques de l'abonnement</CardTitle>
          <CardDescription className="text-blue-700">Aperçu de vos crédits et de l'utilisation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-2 md:space-y-0">
          <div>
            <span className="block text-sm text-blue-800 font-medium">Crédits utilisés</span>
            <span className="text-2xl font-bold text-blue-900">
              {subscription.credits_used} / {subscription.total_credits}
            </span>
          </div>
          <div>
            <span className="block text-sm text-blue-800 font-medium">Crédits restants</span>
            <span className="text-2xl font-bold text-blue-900">{remainingCredits}</span>
          </div>
          <div>
            <span className="block text-sm text-blue-800 font-medium">% Utilisé</span>
            <span className="text-2xl font-bold text-blue-900">{usagePercentage}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suivi d'utilisation</CardTitle>
          <CardDescription>Gérez l'utilisation de vos crédits d'abonnement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Summary */}
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-600">Crédits utilisés</span>
              <span className="font-medium">
                {subscription.credits_used} / {subscription.total_credits}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-sm text-gray-500 mt-1">
              {remainingCredits} crédits restants sur votre abonnement {subscription.plan_name}
            </p>
          </div>

          {/* Use Credits Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-900">Utiliser des crédits</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="credits">Nombre de crédits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max={remainingCredits}
                value={credits}
                onChange={(e) => setCredits(Number.parseInt(e.target.value) || 0)}
                required
              />
              <p className="text-sm text-gray-500">Entrez le nombre de crédits que vous souhaitez utiliser</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez l'utilisation de ces crédits"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="bg-[#0890F1] hover:bg-[#0780d8]"
              disabled={isSubmitting || credits < 1 || credits > remainingCredits}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Traitement...
                </>
              ) : (
                "Utiliser les crédits"
              )}
            </Button>
          </form>

          {/* Usage History */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-4">Historique d'utilisation</h3>

            {usageHistory.length > 0 ? (
              <div className="space-y-3">
                {usageHistory.slice(0, 5).map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{usage.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(new Date(usage.created_at))}</p>
                    </div>
                    <span className="text-sm font-medium text-[#0890F1]">{usage.credits_used} crédits</span>
                  </div>
                ))}

                {usageHistory.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Voir tout l'historique
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucune utilisation récente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
