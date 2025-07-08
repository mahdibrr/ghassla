"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Users,
  Package,
  Truck,
  Calendar,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Save,
  TrendingUp,
  Activity,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  TrendingDown,
  Menu,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"

interface Order {
  id: string
  userId: string
  userName?: string
  userPhone?: string
  userAddress?: string
  status: string
  createdAt: string
  scheduledDate: string | null
  scheduledTime: string | null
  deliveryDate: string | null
  deliveryTime: string | null
  total: number
  address: string
  notes: string
  items: any[]
}

const statusOptions = [
  { value: "pending", label: "En attente", color: "amber" },
  { value: "processing", label: "En traitement", color: "blue" },
  { value: "completed", label: "Terminé", color: "green" },
]

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Erreur lors du chargement des commandes")
    return res.json()
  })

export default function AdminDashboard() {
  const { data: orders = [], error, isLoading, mutate } = useSWR<
    Order[]
  >(
    "http://localhost:8081/api/admin/orders",
    fetcher,
    { refreshInterval: 10000 }
  )
  const [saving, setSaving] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [imageErrorMap, setImageErrorMap] = useState<
    Record<string, Record<number, Record<"imageUrl" | "icon", boolean>>>
  >({})

  const handleUpdate = async (orderId: string, updates: Partial<Order>) => {
    setSaving(orderId)
    try {
      const res = await fetch(`http://localhost:8081/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Erreur lors de la mise à jour")
      await mutate()
    } catch (e: any) {
      alert(e.message)
    }
    setSaving(null)
  }

  const handleImageError = (orderId: string, idx: number, type: "imageUrl" | "icon") => {
    setImageErrorMap((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [idx]: {
          ...(prev[orderId]?.[idx] || {}),
          [type]: true,
        },
      },
    }))
  }

  const filteredOrders = orders.filter(
    (order: Order) =>
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userPhone?.includes(searchTerm),
  )

  // Calculate real statistics
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o: Order) => o.status === "pending").length
  const processingOrders = orders.filter((o: Order) => o.status === "processing").length
  const completedOrders = orders.filter((o: Order) => o.status === "completed").length
  const totalRevenue = orders.reduce((sum: number, o: Order) => sum + o.total, 0)

  // Calculate trends (comparing with previous period - simplified calculation)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayOrders = orders.filter((o: Order) => new Date(o.createdAt).toDateString() === today.toDateString())
  const yesterdayOrders = orders.filter((o: Order) => new Date(o.createdAt).toDateString() === yesterday.toDateString())

  const todayRevenue = todayOrders.reduce((sum: number, o: Order) => sum + o.total, 0)
  const yesterdayRevenue = yesterdayOrders.reduce((sum: number, o: Order) => sum + o.total, 0)

  const revenueTrend =
    yesterdayRevenue > 0 ? (((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1) : "0"

  const ordersTrend =
    yesterdayOrders.length > 0
      ? (((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100).toFixed(1)
      : "0"

  const completedTrend = orders.length > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : "0"

  const pendingTrend = orders.length > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(1) : "0"

  const statsData = [
    {
      title: "Commandes totales",
      value: totalOrders,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      textColor: "text-blue-700 dark:text-blue-300",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: `${ordersTrend}%`,
      trendIcon: Number.parseFloat(ordersTrend) >= 0 ? TrendingUp : TrendingDown,
      trendPositive: Number.parseFloat(ordersTrend) >= 0,
    },
    {
      title: "En attente",
      value: pendingOrders,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/50",
      textColor: "text-amber-700 dark:text-amber-300",
      iconColor: "text-amber-600 dark:text-amber-400",
      trend: `${pendingTrend}%`,
      trendIcon: Activity,
      trendPositive: false,
    },
    {
      title: "Terminées",
      value: completedOrders,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      textColor: "text-green-700 dark:text-green-300",
      iconColor: "text-green-600 dark:text-green-400",
      trend: `${completedTrend}%`,
      trendIcon: TrendingUp,
      trendPositive: true,
    },
    {
      title: "Revenus du jour",
      value: `${todayRevenue.toFixed(2)} TND`,
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      textColor: "text-purple-700 dark:text-purple-300",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: `${revenueTrend}%`,
      trendIcon: Number.parseFloat(revenueTrend) >= 0 ? TrendingUp : TrendingDown,
      trendPositive: Number.parseFloat(revenueTrend) >= 0,
    },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "processing":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Gérez vos commandes et suivez les performances
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => mutate()}
              disabled={isLoading}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-3 sm:px-6 py-2 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>

            <Button
              variant="outline"
              className="sm:hidden p-2 rounded-xl bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="relative overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Background decoration */}
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", stat.color)} />

                  <div className="relative space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-2 sm:p-3 rounded-xl", stat.bgColor)}>
                        <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.iconColor)} />
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                          stat.trendPositive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        <stat.trendIcon className="w-3 h-3" />
                        {stat.trend}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                      <div
                        className={cn("h-1 rounded-full bg-gradient-to-r", stat.color)}
                        style={{ width: `${Math.min(Math.abs(Number.parseFloat(stat.trend.replace("%", ""))), 100)}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">Données en temps réel</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Orders Section */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Toutes les commandes
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""} trouvée
                  {filteredOrders.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
                  />
                </div>
                <Button variant="outline" className="rounded-xl px-4 py-2 text-sm bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Filtrer</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Chargement des données...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    Erreur de chargement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md px-4">{error}</p>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    Aucune commande trouvée
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md px-4">
                    Il n'y a pas de commandes correspondant à votre recherche.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-mono text-slate-600 dark:text-slate-400">
                              #{String(order.id).slice(0, 8)}...
                            </p>
                            <Select
                              value={order.status}
                              onValueChange={(newStatus) => handleUpdate(order.id, { status: newStatus })}
                              disabled={saving === order.id}
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-32 h-8 text-xs rounded-lg",
                                  order.status === "processing" && "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-200",
                                  order.status === "completed" && "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200",
                                  order.status === "pending" && "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-200"
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={cn(
                                          "w-2 h-2 rounded-full",
                                          option.color === "amber" && "bg-amber-500",
                                          option.color === "blue" && "bg-blue-500",
                                          option.color === "green" && "bg-green-500",
                                        )}
                                      />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-900 dark:text-white">
                              {order.userName || order.userId}
                            </span>
                          </div>

                          {order.userPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400">{order.userPhone}</span>
                            </div>
                          )}

                          {order.userAddress && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-600 dark:text-slate-400 truncate max-w-32 sm:max-w-48">
                                {order.userAddress}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                          <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            {order.total.toFixed(2)} TND
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="rounded-xl px-3 py-2"
                        >
                          {expandedOrderId === order.id ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Masquer</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Détails</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Collecte prévue</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {order.scheduledDate
                              ? `${formatDate(new Date(order.scheduledDate)).replace(/ à .*/, "")} à ${order.scheduledTime || "--:--"}`
                              : "Non programmée"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <div className="space-y-1 flex-1">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Livraison</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="date"
                              value={order.deliveryDate || ""}
                              onChange={(e) => handleUpdate(order.id, { deliveryDate: e.target.value })}
                              disabled={saving === order.id}
                              className="text-xs border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                            <input
                              type="time"
                              value={order.deliveryTime || ""}
                              onChange={(e) => handleUpdate(order.id, { deliveryTime: e.target.value })}
                              disabled={saving === order.id}
                              className="text-xs border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleUpdate(order.id, {})}
                      disabled={saving === order.id}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-2 sm:py-3"
                    >
                      {saving === order.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </>
                      )}
                    </Button>

                    {/* Expanded Details */}
                    {expandedOrderId === order.id && (
                      <div className="mt-6 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                          Articles de la commande
                        </h4>

                        {order.items && order.items.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {order.items.map((item: any, idx: number) => {
                              const imageUrlValid =
                                item.imageUrl &&
                                typeof item.imageUrl === "string" &&
                                (item.imageUrl.startsWith("http://") || item.imageUrl.startsWith("https://"));
                              const iconUrlValid =
                                item.icon &&
                                typeof item.icon === "string" &&
                                (item.icon.startsWith("http://") || item.icon.startsWith("https://"));
                              const imageUrlError = imageErrorMap[order.id]?.[idx]?.imageUrl || false;
                              const iconUrlError = imageErrorMap[order.id]?.[idx]?.icon || false;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                    {imageUrlValid && !imageUrlError ? (
                                      <img
                                        src={item.imageUrl || "/placeholder.svg"}
                                        alt={item.unit || item.name || "Article"}
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError(order.id, idx, "imageUrl")}
                                      />
                                    ) : iconUrlValid && !iconUrlError ? (
                                      <img
                                        src={item.icon || "/placeholder.svg"}
                                        alt={item.unit || item.name || "Article"}
                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                        onError={() => handleImageError(order.id, idx, "icon")}
                                      />
                                    ) : (
                                      <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                      {item.unit || item.name || item.nom || "Article"}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                      <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Qté: {item.quantity || item.quantite || 1}
                                      </p>
                                      <p className="text-xs font-medium text-slate-900 dark:text-white">
                                        {item.price || item.prix ?
                                          !isNaN(Number(item.price || item.prix))
                                            ? `${Number(item.price || item.prix).toFixed(2)} TND`
                                            : "-"
                                        : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Aucun article dans cette commande
                            </p>
                          </div>
                        )}

                        {order.notes && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Notes:</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
