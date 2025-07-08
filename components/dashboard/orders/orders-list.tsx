"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Loader2, RefreshCw } from "lucide-react"
import { useUser } from "@clerk/nextjs"

type Order = {
  id: string
  date: string
  status: string
  items: any[]
  total: number
  address?: string
  notes?: string
  pickupDate?: string
  timeSlot?: string
}

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled"

interface OrdersListProps {
  filter?: OrderStatus
}

export function OrdersList({ filter = "all" }: OrdersListProps) {
  const { user } = useUser();
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<OrderStatus>(filter)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [orders, setOrders] = useState<Order[]>([])

  // Fetch orders from backend
  const fetchOrders = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) return

      if (forceRefresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      try {
        const res = await fetch(`/api/orders?userId=${user.id}`)
        const data = await res.json()
        // Map to our Order type
        const mappedOrders = data.map((order: any) => ({
          id: order.id,
          date: order.pickupDate || order.createdAt,
          status: order.status,
          items: order.items || [],
          total: order.total || 0,
          address: order.address,
          notes: order.notes,
          pickupDate: order.pickupDate,
          timeSlot: order.timeSlot,
        }))
        setOrders(mappedOrders)
        setLastRefreshed(new Date())
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [user],
  )

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchOrders()

    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchOrders(true)
    }, 30000)

    return () => clearInterval(refreshInterval)
  }, [fetchOrders])

  // Manual refresh handler
  const handleRefresh = () => {
    fetchOrders(true)
  }

  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "processing":
        return "En cours"
      case "pending":
        return "En attente"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "processing":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleCardClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId)
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/dashboard/commandes/${orderId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#0890F1]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des commandes récentes</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Dernière mise à jour: {formatDate(lastRefreshed.toISOString())}</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="ml-2">
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Actualisation..." : "Actualiser"}
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === status ? "bg-[#0890F1] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(status as OrderStatus)}
          >
            {status === "all" ? "Tous" : getStatusText(status)}
          </button>
        ))}
      </div>

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="relative">
            <div
              className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                selectedOrder === order.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleCardClick(order.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Commande #{order.id}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{formatDate(order.date)}</p>
              <p className="text-sm mb-3 line-clamp-1">{order.items.map(item => item.title || item).join(", ")}</p>
              <div className="flex justify-between items-center">
                <p className="font-medium">{order.total.toFixed(2)} DT</p>
                <Button variant="ghost" size="sm" className="text-xs">
                  {selectedOrder === order.id ? "Masquer" : "Détails"}
                </Button>
              </div>
            </div>

            {selectedOrder === order.id && (
              <div className="mt-2 p-4 rounded-lg border bg-muted animate-in slide-in-from-top-2 duration-200">
                <h4 className="font-medium mb-2">Détails de la commande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{formatDate(order.pickupDate || order.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Créneau:</span>
                    <span>{order.timeSlot || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adresse:</span>
                    <span>{order.address || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notes:</span>
                    <span>{order.notes || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut:</span>
                    <span className={getStatusColor(order.status)}>{getStatusText(order.status)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">Articles:</span>
                    <ul className="list-disc list-inside">
                      {order.items.map((item, index) => (
                        <li key={index}>{item.title || item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{order.total.toFixed(2)} DT</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" className="w-full" onClick={() => handleViewDetails(order.id)}>
                      Voir tous les détails
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {isRefreshing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#0890F1] mb-2" />
              <p>Chargement des commandes...</p>
            </div>
          ) : (
            <div>
              <p>Aucune commande trouvée</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
