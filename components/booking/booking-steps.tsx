"use client"

import { useBooking } from "@/context/booking-context"
import ServiceSelection from "./service-selection"
import ScheduleStep from "./schedule-step"
import PaymentStep from "./payment-step"
import { useState } from "react"

export default function BookingSteps() {
  const { currentStep, setCurrentStep, selectedServices, clearServices } = useBooking()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  // Responsive step indicator
  const steps = [
    { label: "Services" },
    { label: "Horaire" },
    { label: "Paiement" },
  ]

  // Handle order submission
  const handleOrder = async () => {
    setIsSubmitting(true)
    setOrderError(null)
    try {
      // Get userId from localStorage or auth context if available
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : undefined;
      // TODO: Get schedule, address, notes, etc. from context or form (extend booking-context if needed)
      // For now, use placeholders for missing fields
      const orderPayload = {
        userId: userId || undefined,
        address: "Adresse de test", // Replace with real address from context/form
        notes: "", // Replace with real notes from context/form
        pickupDate: new Date().toISOString(), // Replace with real pickup date from context
        timeSlot: "08:00 - 10:00", // Replace with real time slot from context
        items: selectedServices.map(s => ({
          serviceId: s.id,
          title: s.title,
          description: s.description,
          price: s.price,
          unit: s.unit,
          icon: s.icon,
          quantity: s.quantity || 1,
          category: s.category || '',
        })),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) throw new Error("Erreur lors de la création de la commande")
      setOrderSuccess(true)
      clearServices()
    } catch (e: any) {
      setOrderError(e.message || "Erreur inconnue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Step indicators */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 min-w-[70px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-bold transition-colors duration-200 ${
                  currentStep === idx + 1
                    ? "bg-[#0890F1] text-white"
                    : idx + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs text-gray-500 text-center">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-1 w-full bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-[#0890F1] rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div>
        {currentStep === 1 && <ServiceSelection />}
        {currentStep === 2 && <ScheduleStep />}
        {currentStep === 3 && (
          <div>
            <PaymentStep />
            {orderError && <div className="text-red-500 text-sm mt-2">{orderError}</div>}
            {orderSuccess && (
              <div className="text-green-600 text-center mt-4 font-semibold">
                Merci pour votre commande ! Vous recevrez une confirmation par email.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
