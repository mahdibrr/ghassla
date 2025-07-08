"use client"

import { useState } from "react"
import { CreditCard, Wallet, Truck } from "lucide-react"
import { useBooking } from "@/context/booking-context"

export default function PaymentStep() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const { selectedServices, totalPrice } = useBooking()

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Paiement</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Payment methods */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Méthode de paiement</h3>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-lg border flex items-center transition-colors ${
                paymentMethod === "card" ? "border-[#0890F1] bg-blue-50" : "border-gray-200 hover:border-[#0890F1]"
              }`}
            >
              <CreditCard size={20} className={paymentMethod === "card" ? "text-[#0890F1]" : "text-gray-400"} />
              <div className="ml-3 text-left">
                <span className={`block font-medium ${paymentMethod === "card" ? "text-[#0890F1]" : "text-gray-700"}`}>
                  Carte bancaire
                </span>
                <span className="text-xs text-gray-500">Paiement sécurisé en ligne</span>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full p-4 rounded-lg border flex items-center transition-colors ${
                paymentMethod === "cash" ? "border-[#0890F1] bg-blue-50" : "border-gray-200 hover:border-[#0890F1]"
              }`}
            >
              <Wallet size={20} className={paymentMethod === "cash" ? "text-[#0890F1]" : "text-gray-400"} />
              <div className="ml-3 text-left">
                <span className={`block font-medium ${paymentMethod === "cash" ? "text-[#0890F1]" : "text-gray-700"}`}>
                  Paiement à la livraison
                </span>
                <span className="text-xs text-gray-500">Payez en espèces à la réception</span>
              </div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                  />
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Order summary */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Récapitulatif</h3>

          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {selectedServices.map((service) => (
                <li key={service.id} className="py-3 flex justify-between">
                  <div>
                    <span className="block font-medium text-gray-700">{service.title}</span>
                    <span className="text-sm text-gray-500">
                      {service.quantity || 1} x {service.price} DT{service.unit}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">
                    {(Number.parseFloat(service.price) * (service.quantity || 1)).toFixed(2)} DT
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium">{totalPrice.toFixed(2)} DT</span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Frais de livraison</span>
                <span className="font-medium">0.00 DT</span>
              </div>

              <div className="flex justify-between font-bold mt-4 text-lg">
                <span>Total</span>
                <span className="text-[#0890F1]">{totalPrice.toFixed(2)} DT</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm text-gray-500">
              <Truck size={16} className="mr-2" />
              <span>Livraison estimée: 48h après la collecte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
