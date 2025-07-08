"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type ServiceItem = {
  id: string
  title: string
  description: string
  price: string
  unit: string
  icon: string
  quantity?: number
  subPrice?: string
  category?: string
}

export type BookingContextType = {
  selectedServices: ServiceItem[]
  addService: (service: ServiceItem) => void
  removeService: (serviceId: string) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  clearServices: () => void
  totalPrice: number
  currentStep: number
  setCurrentStep: (step: number) => void
  scheduledDate: Date | undefined
  setScheduledDate: (date: Date | undefined) => void
  scheduledTimeSlot: string | null
  setScheduledTimeSlot: (slot: string | null) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState<string | null>(null)

  // Calculate total price whenever selected services change
  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => {
      const price = Number.parseFloat(service.price)
      const quantity = service.quantity || 1
      return sum + price * quantity
    }, 0)
    setTotalPrice(total)
  }, [selectedServices])

  const addService = (service: ServiceItem) => {
    setSelectedServices((prev) => {
      // Check if service already exists
      const existingServiceIndex = prev.findIndex((s) => s.id === service.id)

      if (existingServiceIndex >= 0) {
        // Update quantity if service exists
        const updatedServices = [...prev]
        const existingService = updatedServices[existingServiceIndex]
        updatedServices[existingServiceIndex] = {
          ...existingService,
          quantity: (existingService.quantity || 1) + 1,
        }
        return updatedServices
      } else {
        // Add new service with quantity 1
        return [...prev, { ...service, quantity: 1 }]
      }
    })
  }

  const removeService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== serviceId))
  }

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId)
      return
    }

    setSelectedServices((prev) =>
      prev.map((service) => (service.id === serviceId ? { ...service, quantity } : service)),
    )
  }

  const clearServices = () => {
    setSelectedServices([])
  }

  return (
    <BookingContext.Provider
      value={{
        selectedServices,
        addService,
        removeService,
        updateQuantity,
        clearServices,
        totalPrice,
        currentStep,
        setCurrentStep,
        scheduledDate,
        setScheduledDate,
        scheduledTimeSlot,
        setScheduledTimeSlot,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
