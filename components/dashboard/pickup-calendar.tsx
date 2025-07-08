"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { fr } from "date-fns/locale"

export const PickupCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample pickup dates - in a real app, these would come from the API
  const pickupDates = [
    new Date(2024, 3, 18), // April 18, 2024
    new Date(2024, 3, 25), // April 25, 2024
    new Date(2024, 4, 2), // May 2, 2024
  ]

  // Delivery dates based on pickups (typically 2 days after pickup)
  const deliveryDates = pickupDates.map((date) => {
    const delivery = new Date(date)
    delivery.setDate(delivery.getDate() + 2)
    return delivery
  })

  // Check if a date is a pickup date
  const isPickupDate = (date: Date) => {
    return pickupDates.some(
      (pickup) =>
        pickup.getDate() === date.getDate() &&
        pickup.getMonth() === date.getMonth() &&
        pickup.getFullYear() === date.getFullYear(),
    )
  }

  // Check if a date is a delivery date
  const isDeliveryDate = (date: Date) => {
    return deliveryDates.some(
      (delivery) =>
        delivery.getDate() === date.getDate() &&
        delivery.getMonth() === date.getMonth() &&
        delivery.getFullYear() === date.getFullYear(),
    )
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={fr}
        modifiers={{
          pickup: pickupDates,
          delivery: deliveryDates,
        }}
        modifiersClassNames={{
          pickup: "pickup-date",
          delivery: "delivery-date",
        }}
        className="rounded-md border"
      />

      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#0890F1] rounded-full mr-2"></div>
          <span>Collecte</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Livraison</span>
        </div>
      </div>

      <style jsx global>{`
        .pickup-date:not(.day-outside) {
          background-color: rgba(8, 144, 241, 0.1);
          color: #0890F1;
          font-weight: bold;
          border: 1px solid #0890F1;
        }
        
        .delivery-date:not(.day-outside) {
          background-color: rgba(34, 197, 94, 0.1);
          color: rgb(22, 163, 74);
          font-weight: bold;
          border: 1px solid rgb(22, 163, 74);
        }
      `}</style>
    </div>
  )
}
