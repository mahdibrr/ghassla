"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Bell, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NotificationPreferences() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState({
    emailOrderUpdates: true,
    emailPromotions: false,
    emailNewsletter: true,
    smsOrderUpdates: true,
    smsDelivery: true,
    smsPromotions: false,
    pushNotifications: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été mises à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de vos préférences",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Préférences de notification</h2>
        <p className="text-gray-600">Gérez comment et quand vous souhaitez recevoir des notifications de notre part.</p>

        {/* Email Notifications */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-[#0890F1]" />
            Notifications par email
          </h3>

          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailOrderUpdates" className="font-medium">
                  Mises à jour des commandes
                </Label>
                <p className="text-sm text-gray-500">Recevez des emails concernant l'état de vos commandes</p>
              </div>
              <Switch
                id="emailOrderUpdates"
                checked={settings.emailOrderUpdates}
                onCheckedChange={() => handleToggle("emailOrderUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailPromotions" className="font-medium">
                  Offres et promotions
                </Label>
                <p className="text-sm text-gray-500">Recevez des emails sur nos offres spéciales et promotions</p>
              </div>
              <Switch
                id="emailPromotions"
                checked={settings.emailPromotions}
                onCheckedChange={() => handleToggle("emailPromotions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNewsletter" className="font-medium">
                  Newsletter
                </Label>
                <p className="text-sm text-gray-500">Recevez notre newsletter mensuelle</p>
              </div>
              <Switch
                id="emailNewsletter"
                checked={settings.emailNewsletter}
                onCheckedChange={() => handleToggle("emailNewsletter")}
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-[#0890F1]" />
            Notifications par SMS
          </h3>

          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsOrderUpdates" className="font-medium">
                  Mises à jour des commandes
                </Label>
                <p className="text-sm text-gray-500">Recevez des SMS concernant l'état de vos commandes</p>
              </div>
              <Switch
                id="smsOrderUpdates"
                checked={settings.smsOrderUpdates}
                onCheckedChange={() => handleToggle("smsOrderUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsDelivery" className="font-medium">
                  Notifications de livraison
                </Label>
                <p className="text-sm text-gray-500">
                  Recevez des SMS lorsque votre commande est en cours de livraison
                </p>
              </div>
              <Switch
                id="smsDelivery"
                checked={settings.smsDelivery}
                onCheckedChange={() => handleToggle("smsDelivery")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsPromotions" className="font-medium">
                  Offres et promotions
                </Label>
                <p className="text-sm text-gray-500">Recevez des SMS sur nos offres spéciales et promotions</p>
              </div>
              <Switch
                id="smsPromotions"
                checked={settings.smsPromotions}
                onCheckedChange={() => handleToggle("smsPromotions")}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-[#0890F1]" />
            Notifications push
          </h3>

          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="font-medium">
                  Toutes les notifications
                </Label>
                <p className="text-sm text-gray-500">Recevez des notifications push sur votre appareil</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200 mt-6">
          <AlertDescription className="text-blue-800">
            Vous pouvez modifier vos préférences de notification à tout moment.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">
          Annuler
        </Button>
        <Button type="submit" className="bg-[#0890F1] hover:bg-[#0780d8]" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les préférences"
          )}
        </Button>
      </div>
    </form>
  )
}
