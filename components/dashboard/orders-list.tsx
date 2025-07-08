"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-06-15T10:30:00",
    status: "completed",
    items: ["Lavage Chemise", "Repassage Pantalon"],
    total: 24.99,
  },
  {
    id: "ORD-002",
    date: "2023-06-20T14:45:00",
    status: "processing",
    items: ["Lavage Complet", "Repassage Costume"],
    total: 39.99,
  },
  {
    id: "ORD-003",
    date: "2023-06-25T09:15:00",
    status: "pending",
    items: ["Nettoyage à Sec", "Repassage Chemise"],
    total: 19.99,
  },
]

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled"

interface OrdersListProps {
  filter?: OrderStatus
}

export function OrdersList({ filter = "all" }: OrdersListProps) {
  const [activeTab, setActiveTab] = useState<OrderStatus>(filter)

  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" ? mockOrders : mockOrders.filter((order) => order.status === activeTab)

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Liste des commandes récentes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Commande #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>
                <span className={getStatusColor(order.status)}>{getStatusText(order.status)}</span>
              </TableCell>
              <TableCell>{order.items.join(", ")}</TableCell>
              <TableCell className="text-right">{order.total.toFixed(2)} €</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
