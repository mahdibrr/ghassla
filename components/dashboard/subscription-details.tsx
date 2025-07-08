"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, BarChart } from "lucide-react"

type SubscriptionDetailsProps = {
  subscription: {
    name: string
    creditsUsed: number
    totalCredits: number
    nextPaymentDate: string
    isActive: boolean
  } | null
  isLoading?: boolean
}

export default function SubscriptionDetails({ subscription, isLoading = false }: SubscriptionDetailsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Abonnement</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Abonnement</CardTitle>
          <CardDescription>Vous n'avez pas d'abonnement actif</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">
              Découvrez nos formules d'abonnement pour économiser sur vos commandes régulières.
            </p>
            <Link href="/dashboard/subscription">
              <Button className="bg-[#0890F1] hover:bg-[#0780d8]">Voir les abonnements</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Abonnement</CardTitle>
          <Badge className={subscription.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {subscription.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <CardDescription>{subscription.name}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Crédits utilisés</span>
            <span className="font-medium">
              {subscription.creditsUsed} / {subscription.totalCredits}
            </span>
          </div>
          <Progress
            value={subscription.totalCredits > 0 ? (subscription.creditsUsed / subscription.totalCredits) * 100 : 0}
            className="h-2"
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Prochaine facturation</span>
              <span className="text-sm font-medium">{subscription.nextPaymentDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Link href="/dashboard/subscription">
          <Button size="sm" className="bg-[#0890F1] hover:bg-[#0780d8]">
            Gérer
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
