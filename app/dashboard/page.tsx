"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Clock, Shirt, TrendingUp, PlusCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"

// Types for dashboard data
interface RecentOrder {
  id: string
  date: Date
  status: string
  total: number | string
  items: string[] | string
}
interface SubscriptionData {
  name: string
  creditsUsed: number
  totalCredits: number
  nextPaymentDate: string
  isActive: boolean
}
interface StatsData {
  orderCount: number
  nextPickup: Date | null
  nextDelivery: Date | null
  recentActivity: { type: string; date: Date; description: string }[]
  currentOrder?: {
    status: string;
    scheduledDate: string | null;
    scheduledTime: string | null;
  } | null;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [statsLoading, setStatsLoading] = useState(true)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)

  const [stats, setStats] = useState<StatsData>({
    orderCount: 0,
    nextPickup: null,
    nextDelivery: null,
    recentActivity: [],
    currentOrder: null,
  })

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [subscriptionLastRefreshed, setSubscriptionLastRefreshed] = useState<Date | null>(null)

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentOrdersLoading, setRecentOrdersLoading] = useState(true)
  const [recentOrdersError, setRecentOrdersError] = useState<string | null>(null)

  // Fetch all dashboard data from backend
  const refreshData = useCallback(async () => {
    if (!user?.id) return

    setStatsLoading(true)
    setSubscriptionLoading(true)
    setOrdersLoading(true)
    setActivityLoading(true)

    try {
      // Fetch stats
const statsRes = await fetch(`/api/dashboard/stats?userId=${user.id}`)

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          orderCount: statsData.orderCount,
          nextPickup: statsData.nextPickup ? new Date(statsData.nextPickup) : null,
          nextDelivery: statsData.nextDelivery ? new Date(statsData.nextDelivery) : null,
          recentActivity: statsData.recentActivity || [],
          currentOrder: statsData.currentOrder || null,
        })
      }
      setStatsLoading(false)
      setOrdersLoading(false)
      setActivityLoading(false)
    } catch (e) {
      console.error("Error fetching stats:", e)
      setStatsLoading(false)
      setOrdersLoading(false)
      setActivityLoading(false)
    }

    try {
      // Fetch subscription
const subRes = await fetch(`/api/subscriptions?userId=${user.id}`)
      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscription({
          name: subData.plan,
          creditsUsed: subData.creditsUsed || 0,
          totalCredits: subData.totalCredits || 0,
          nextPaymentDate: subData.nextPaymentDate || "",
          isActive: subData.status === "ACTIVE",
        })
        setSubscriptionLastRefreshed(new Date())
        setSubscriptionError(null)
      } else {
        setSubscriptionError("Erreur lors du chargement de l'abonnement")
      }
      setSubscriptionLoading(false)
    } catch (e) {
      console.error("Error fetching subscription:", e)
      setSubscriptionError("Erreur lors du chargement de l'abonnement")
      setSubscriptionLoading(false)
    }

    try {
      // Fetch recent orders
      const ordersRes = await fetch(`/api/orders?userId=${user.id}&limit=5`)
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setRecentOrders(
          ordersData.map((order: any) => ({
            id: order.id,
            date: order.createdAt,
            status: order.status,
            total: order.total || 0,
            items: order.items || [],
          }))
        )
        setRecentOrdersError(null)
      } else {
        setRecentOrdersError("Erreur lors du chargement des commandes")
      }
      setRecentOrdersLoading(false)
    } catch (e) {
      console.error("Error fetching recent orders:", e)
      setRecentOrdersError("Erreur lors du chargement des commandes")
      setRecentOrdersLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user?.id) {
      refreshData()
      // Auto-refresh every 5 minutes
      const intervalId = setInterval(refreshData, 300000)
      return () => clearInterval(intervalId)
    }
  }, [user, refreshData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          {/* Welcome Section - Top Card */}
          <Card className="mb-8 bg-gradient-to-r from-[#0890F1] to-[#0780d8] text-white">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">
                    Bonjour, {user?.firstName}
                    <span className="ml-2" role="img" aria-label="wave">
                      👋
                    </span>
                  </CardTitle>
                  <CardDescription className="text-blue-50 mt-2">
                    Bienvenue sur votre tableau de bord personnel
                  </CardDescription>
                </div>
                <Link href="/prix-et-services">
                  <Button variant="secondary" size="sm" className="bg-white text-[#0890F1] hover:bg-blue-50">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle commande
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-xs font-medium mb-1 uppercase tracking-wider text-blue-100">Commandes totales</div>
                  <div className="text-2xl font-bold flex items-center">
                    {statsLoading ? (
                      <LoadingSpinner size={16} className="mr-2 text-white" />
                    ) : (
                      <>
                        {stats.orderCount}
                        <TrendingUp className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-xs font-medium mb-1 uppercase tracking-wider text-blue-100">Prochaine collecte</div>
                  <div className="text-lg font-medium flex items-center">
                    {statsLoading ? (
                      <LoadingSpinner size={16} className="mr-2 text-white" />
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        {stats.nextPickup && stats.currentOrder && stats.currentOrder.scheduledTime ? (
                          <>
                            {stats.currentOrder.scheduledDate
                              ? formatDate(new Date(stats.currentOrder.scheduledDate)).replace(/ à .*/, "")
                              : formatDate(stats.nextPickup).replace(/ à .*/, "")}
                            <span className="mx-2">|</span>
                            <span>{stats.currentOrder.scheduledTime}</span>
                          </>
                        ) : stats.nextPickup ? (
                          formatDate(stats.nextPickup)
                        ) : (
                          "Non programmée"
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-xs font-medium mb-1 uppercase tracking-wider text-blue-100">Prochaine livraison</div>
                  <div className="text-lg font-medium flex items-center">
                    {statsLoading ? (
                      <LoadingSpinner size={16} className="mr-2 text-white" />
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        {stats.nextDelivery ? formatDate(stats.nextDelivery) : "Aucune programmée"}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content in 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Two-thirds width on large screens */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-blue-50 p-4">
                 <CardTitle className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2 text-[#0890F1]" />
                      Nombre de commandes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">
                      {statsLoading ? <LoadingSpinner size={16} /> : stats.orderCount}
                    </div>
                    <p className="text-sm text-gray-500">Commandes totales</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3 flex justify-center">
                    <Link href="/dashboard/commandes" className="text-xs text-blue-600 hover:text-blue-800">
                      Voir l'historique →
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="bg-blue-50 p-4">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <Shirt className="h-4 w-4 mr-2 text-[#0890F1]" />
                      Service actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {statsLoading ? (
                      <LoadingSpinner size={16} />
                    ) : stats.currentOrder ? (
                      <>
                        <Badge className={getStatusColor(stats.currentOrder.status)}>
                          {stats.currentOrder.status === "completed"
                            ? "Terminé"
                            : stats.currentOrder.status === "processing"
                            ? "En traitement"
                            : "En attente"}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-2">
                          Collecté le {stats.currentOrder.scheduledDate ? formatDate(new Date(stats.currentOrder.scheduledDate)) : "-"}
                        </p>
                      </>
                    ) : (
                      <>
                        <Badge className="bg-gray-100 text-gray-800 font-normal">Aucun service</Badge>
                        <p className="text-sm text-gray-500 mt-2">Aucune collecte récente</p>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3 flex justify-center">
                    <Link href="/dashboard/commandes" className="text-xs text-blue-600 hover:text-blue-800">
                      Voir les détails →
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="bg-blue-50 p-4">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2 text-[#0890F1]" />
                      Prochaine collecte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm font-medium">
                      {statsLoading ? (
                        <LoadingSpinner size={16} />
                      ) : stats.nextPickup && stats.currentOrder && stats.currentOrder.scheduledTime ? (
                        <>
                          {stats.currentOrder.scheduledDate
                            ? formatDate(new Date(stats.currentOrder.scheduledDate)).replace(/ à .*/, "")
                            : formatDate(stats.nextPickup).replace(/ à .*/, "")}
                          <div className="text-sm text-gray-500 mt-3">
                            {stats.currentOrder.scheduledTime}
                          </div>
                        </>
                      ) : stats.nextPickup ? (
                        formatDate(stats.nextPickup)
                      ) : (
                        "Non programmée"
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {/* Optionally, you can show more details here if needed */}
                    </p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3 flex justify-center">
                    <Button variant="ghost" className="text-xs text-blue-600 hover:text-blue-800 h-auto p-0">
                      Programmer une collecte
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Commandes récentes</CardTitle>
                    <CardDescription>Historique de vos dernières commandes</CardDescription>
                  </div>
                  <Link href="/dashboard/commandes">
                    <Button variant="outline" size="sm">
                      Tout voir
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentOrdersLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size={24} className="text-[#0890F1]" />
                    </div>
                  ) : recentOrdersError ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-red-500 mb-2">{recentOrdersError}</p>
                      <Button variant="outline" size="sm" onClick={() => refreshData()}>
                        Réessayer
                      </Button>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order: RecentOrder) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-medium">Commande #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {Array.isArray(order.items)
                                ? order.items.join(", ")
                                : typeof order.items === "string"
                                ? order.items
                                : "Articles divers"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status === "completed"
                                ? "Terminé"
                                : order.status === "processing"
                                ? "En traitement"
                                : "En attente"}
                            </Badge>
                            <p className="text-sm font-medium text-gray-700 mt-1">{order.total} DT</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Vous n'avez pas de commandes récentes.</p>
                      <Link href="/prix-et-services">
                        <Button size="sm" className="mt-4 bg-[#0890F1] hover:bg-[#0780d8]">
                          Créer votre première commande
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - One-third width on large screens */}
            <div className="space-y-8">
              {/* Subscription Card */}
              {subscriptionLoading ? (
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Abonnement</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
                    <LoadingSpinner size={24} className="text-[#0890F1]" />
                  </CardContent>
                </Card>
              ) : subscriptionError ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Abonnement</CardTitle>
                    <CardDescription>Erreur de chargement</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                      <p className="text-red-600 text-sm">{subscriptionError}</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => refreshData()}>
                        Réessayer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : subscription ? (
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
                        <span className="font-medium">{`${subscription.creditsUsed} / ${subscription.totalCredits}`}</span>
                      </div>
                      <Progress value={(subscription.creditsUsed / subscription.totalCredits) * 100} className="h-2" />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Prochaine facturation</span>
                            <span className="text-sm font-medium">{subscription.nextPaymentDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {subscriptionLastRefreshed && (
                      <div className="mt-4 text-xs text-gray-400 text-center">
                        Dernière mise à jour: {formatDate(subscriptionLastRefreshed)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                  
                    <Link href="/dashboard/subscription">
                      <Button size="sm" className="bg-[#0890F1] hover:bg-[#0780d8]">
                        Gérer
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Abonnement</CardTitle>
                    <CardDescription>Vous n'avez pas d'abonnement actif</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-4">
                        Découvrez nos formules d'abonnement pour économiser sur  régulières.
                      </p>
                      <Link href="/dashboard/subscription">
                        <Button className="bg-[#0890F1] hover:bg-[#0780d8]">Voir les abonnements</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Support Card */}
              <Card>
                <CardHeader className="bg-gray-50 pb-4">
                  <CardTitle className="text-md">Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600 mb-4">Notre équipe de support est disponible pour vous aider 7j/7.</p>
                  <Button className="w-full bg-[#0890F1] hover:bg-[#0780d8]">Contacter le support</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
