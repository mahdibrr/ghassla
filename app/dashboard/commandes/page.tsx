import { OrdersList } from "@/components/dashboard/orders/orders-list"

export default function CommandesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes Commandes</h1>
        <p className="text-gray-500">Consultez l'historique et le statut de </p>
      </div>
      <OrdersList />
    </div>
  )
}
