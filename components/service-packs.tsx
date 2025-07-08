"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PackSize = "5kg" | "10kg"

export default function ServicePacks() {
  const [packSize, setPackSize] = useState<PackSize>("5kg")

  const servicePacks = [
    {
      name: "Pack Standard",
      description: "Service de lavage et repassage ponctuel",
      price: packSize === "5kg" ? "25" : "45",
      features: ["Collecte et livraison à domicile", "Lavage et séchage", "Repassage inclus", "Livraison en 48h"],
      popular: false,
    },
    {
      name: "Pack Mensuel",
      description: "4 services avec collectes programmées",
      price: packSize === "5kg" ? "90" : "160",
      priceDetail: packSize === "5kg" ? "22,5 DT par service" : "40 DT par service",
      features: [
        "4 collectes par mois",
        "Planification flexible",
        "Lavage et séchage",
        "Repassage inclus",
        "Livraison en 48h",
      ],
      popular: true,
    },
    {
      name: "Pack 6 Mois",
      description: "24 services sur 6 mois",
      price: packSize === "5kg" ? "480" : "840",
      priceDetail: packSize === "5kg" ? "20 DT par service" : "35 DT par service",
      features: [
        "24 collectes sur 6 mois",
        "Planification flexible",
        "Lavage et séchage",
        "Repassage inclus",
        "Livraison en 48h",
        "Service prioritaire",
      ],
      popular: false,
    },
    {
      name: "Pack Gold",
      description: "Service premium avec pré-tri",
      price: packSize === "5kg" ? "35" : "55",
      features: [
        "Collecte et livraison à domicile",
        "Service de pré-tri inclus",
        "Lavage et séchage premium",
        "Repassage soigné",
        "Livraison en 48h",
        "Traitement prioritaire",
      ],
      popular: false,
      highlight: true,
    },
  ]

  const additionalServices = [
    {
      name: "Nettoyage de chaussures",
      price: "à partir de 15",
      tooltip: "Prix variable selon le type de chaussures",
    },
    {
      name: "Nettoyage de vestes",
      price: "à partir de 20",
      tooltip: "Prix variable selon le type et la taille de la veste",
    },
    {
      name: "Articles spéciaux",
      price: "sur devis",
      tooltip: "Contactez-nous pour un devis personnalisé pour vos articles spéciaux",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Pack size selector */}
      <div className="mb-8 sm:mb-10">
        <h3 className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4">
          Choisissez votre capacité de lavage
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => setPackSize("5kg")}
            className={cn(
              "flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-center transition-all border-2",
              packSize === "5kg"
                ? "bg-[#0890F1] text-white border-[#0890F1]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#0890F1] hover:text-[#0890F1]",
            )}
          >
            <div className="font-bold text-lg sm:text-xl mb-1">5kg</div>
            <div className="text-xs sm:text-sm opacity-90">Idéal pour 1-2 personnes</div>
          </button>
          <button
            onClick={() => setPackSize("10kg")}
            className={cn(
              "flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-center transition-all border-2",
              packSize === "10kg"
                ? "bg-[#0890F1] text-white border-[#0890F1]"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#0890F1] hover:text-[#0890F1]",
            )}
          >
            <div className="font-bold text-lg sm:text-xl mb-1">10kg</div>
            <div className="text-xs sm:text-sm opacity-90">Idéal pour 3-4 personnes</div>
          </button>
        </div>
      </div>

      {/* Service packs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {servicePacks.map((pack) => (
          <div
            key={pack.name}
            className={cn(
              "bg-white rounded-xl overflow-hidden border transition-all hover:shadow-lg",
              pack.popular
                ? "border-[#FFD06D] shadow-md"
                : pack.highlight
                  ? "border-[#FFD06D] shadow-md"
                  : "border-gray-200",
            )}
          >
            {pack.popular && (
              <div className="bg-[#FFD06D] text-[#0890F1] text-xs font-bold uppercase py-1 px-4 text-center">
                Le plus populaire
              </div>
            )}
            {pack.highlight && (
              <div className="bg-[#FFD06D] text-[#0890F1] text-xs font-bold uppercase py-1 px-4 text-center">
                Premium
              </div>
            )}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-[#0890F1]">{pack.name}</h3>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm h-8 sm:h-10">{pack.description}</p>
              <div className="mt-3 sm:mt-4 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{pack.price}</span>
                <span className="text-gray-600 ml-1">DT</span>
              </div>
              {pack.priceDetail && <p className="text-xs text-gray-500">{pack.priceDetail}</p>}
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#0890F1] mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 sm:mt-8 w-full bg-[#0890F1] hover:bg-[#0780d8] text-white font-medium py-2 px-4 rounded-lg transition-colors text-xs sm:text-sm">
                Choisir ce pack
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional information */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mt-8 sm:mt-12">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Informations complémentaires</h3>
        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
          <li>• Les prix incluent la collecte et la livraison à domicile dans Tunis.</li>
          <li>• Délai de livraison standard : 48h après la collecte.</li>
          <li>• Service express disponible avec supplément (livraison en 24h).</li>
          <li>• Paiement à la livraison ou en ligne.</li>
          <li>• Annulation gratuite jusqu'à 2h avant l'heure de collecte prévue.</li>
        </ul>
      </div>
    </div>
  )
}
