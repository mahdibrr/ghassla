"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, Trash2, ShoppingBag } from "lucide-react"
import { useBooking } from "@/context/booking-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function OrderSummary() {
  const { selectedServices, removeService, updateQuantity, totalPrice, currentStep, setCurrentStep, scheduledDate, scheduledTimeSlot } = useBooking()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const { user } = useUser()

  const handleProceed = () => {
    if (selectedServices.length > 0) {
      if (currentStep === 3) {
        toast({
          title: "Succès",
          description: "Votre commande a été enregistrée avec succès."
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  // Handle order submission
  const handleOrder = async () => {
    setIsSubmitting(true)
    setOrderError(null)
    try {
      const userId = user?.id;
      if (!userId) {
        setOrderError("Impossible de récupérer l'identifiant utilisateur. Veuillez vous reconnecter.");
        setIsSubmitting(false);
        return;
      }
      const address = user?.publicMetadata?.address || "";
      const now = new Date();
      const orderPayload = {
        user_id: userId,
        status: "PENDING",
        created_at: now.toISOString(),
        scheduled_date: scheduledDate ? scheduledDate.toISOString().split('T')[0] : null,
        scheduled_time: scheduledTimeSlot || null,
        delivery_date: null, // Replace with real value if available
        delivery_time: null, // Replace with real value if available
        total: totalPrice || null,
        address,
        notes: "", // Replace with real notes from context/form
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
      console.log("Order payload sent to backend:", JSON.stringify(orderPayload, null, 2));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) throw new Error("Erreur lors de la création de la commande")
      setOrderSuccess(true)
      toast({
        title: "Succès",
        description: "Votre commande a été enregistrée avec succès."
      })
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (e: any) {
      setOrderError(e.message || "Erreur inconnue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 w-full max-w-md mx-auto">
      {/* Header */}
      <div
        className="bg-[#0890F1] text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={18} />
          <h3 className="font-semibold">Résumé de commande</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">{totalPrice.toFixed(2)} DT</span>
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>
      </div>

      {/* Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? "max-h-0" : "max-h-[500px]"} overflow-auto`}>        
        {selectedServices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>Votre panier est vide</p>
            <p className="text-sm mt-2">Sélectionnez des services pour commencer</p>
          </div>
        ) : (
          <div className="p-4">
            <ul className="divide-y divide-gray-100">
              {selectedServices.map((service) => (
                <li key={service.id} className="py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 flex-shrink-0">
                      <Image
                        src={service.icon || "/placeholder.svg?height=40&width=40"}
                        alt={service.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                      <p className="font-medium text-sm text-center sm:text-left">{service.title}</p>
                      <div className="flex items-center mt-1">
                        <button
                          className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center"
                          onClick={() => updateQuantity(service.id, (service.quantity || 1) - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm">{service.quantity || 1}</span>
                        <button
                          className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center"
                          onClick={() => updateQuantity(service.id, (service.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <span className="text-[#0890F1] font-medium">
                      {(Number.parseFloat(service.price) * (service.quantity || 1)).toFixed(2)} DT
                    </span>
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#0890F1]">{totalPrice.toFixed(2)} DT</span>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {currentStep <= 3 && (
          <div className="p-4 bg-gray-50 flex flex-col gap-2">
            {currentStep > 1 && (
              <Button variant="outline" className="w-full" onClick={handleBack}>
                Retour
              </Button>
            )}
            <Button
              className="w-full bg-[#0890F1] hover:bg-[#0780d8]"
              disabled={selectedServices.length === 0 || isSubmitting || orderSuccess}
              onClick={currentStep === 3 ? handleOrder : handleProceed}
            >
              {isSubmitting ? "Envoi en cours..." : currentStep === 1 ? "Continuer" : currentStep === 3 ? "Payer et réserver" : "Suivant"}
            </Button>
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
