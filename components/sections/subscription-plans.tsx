"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SubscriptionPlans() {
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly")

  const plans = [
    {
      name: "Essentiel",
      weeklyPrice: "30",
      monthlyPrice: "90",
      description: "Idéal pour les célibataires ou couples",
      features: [
        { included: true, text: "1 collecte par semaine" },
        { included: true, text: "Jusqu'à 5kg de linge par collecte" },
        { included: true, text: "Lavage et séchage" },
        { included: true, text: "Livraison en 48h" },
        { included: false, text: "Repassage inclus" },
      ],
      color: "bg-blue-50",
      hoverColor: "bg-blue-100",
    },
    {
      name: "Famille",
      weeklyPrice: "50",
      monthlyPrice: "160",
      description: "Parfait pour les familles",
      features: [
        { included: true, text: "1 collecte par semaine" },
        { included: true, text: "Jusqu'à 10kg de linge par collecte" },
        { included: true, text: "Lavage et séchage" },
        { included: true, text: "Repassage inclus" },
        { included: true, text: "Livraison en 48h" },
      ],
      color: "bg-yellow-50",
      hoverColor: "bg-yellow-100",
      popular: true,
    },
    {
      name: "Premium",
      weeklyPrice: "75",
      monthlyPrice: "240",
      description: "Service VIP complet",
      features: [
        { included: true, text: "2 collectes par semaine" },
        { included: true, text: "Jusqu'à 15kg de linge par collecte" },
        { included: true, text: "Lavage et séchage premium" },
        { included: true, text: "Repassage soigné" },
        { included: true, text: "Livraison en 24h" },
        { included: true, text: "Service prioritaire" },
      ],
      color: "bg-green-50",
      hoverColor: "bg-green-100",
    },
  ]

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full inline-flex">
          <button
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              frequency === "weekly"
                ? "bg-[#0890F1] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
            )}
            onClick={() => setFrequency("weekly")}
          >
            Hebdomadaire
          </button>
          <button
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors",
              frequency === "monthly"
                ? "bg-[#0890F1] text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
            )}
            onClick={() => setFrequency("monthly")}
          >
            Mensuel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2",
              plan.color,
              "dark:bg-gray-800 dark:border dark:border-blue-700",
              plan.popular ? "ring-2 ring-[#FFD06D]" : "",
            )}
          >
            {plan.popular && (
              <div className="bg-[#FFD06D] text-[#0890F1] text-xs font-bold uppercase py-1 px-4 rounded-full inline-block mb-4">
                Plus populaire
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{plan.description}</p>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#0890F1] dark:text-white">
                  {frequency === "weekly" ? plan.weeklyPrice : plan.monthlyPrice}
                </span>
                <span className="text-lg ml-1 text-gray-600 dark:text-gray-300">DT</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {frequency === "weekly" ? "par semaine" : "par mois"}
              </p>
            </div>

            <ul className="mb-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-[#0890F1] mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-sm ${feature.included ? "text-gray-600 dark:text-gray-300" : "text-gray-400"}`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button className="w-full bg-[#0890F1] hover:bg-[#0780d8] text-white">S'abonner</Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment. Livraison gratuite incluse dans
          tous les forfaits.
        </p>
      </div>
    </div>
  )
}
