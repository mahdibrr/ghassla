"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ServiceFeature = {
  name: string
  standard: boolean
  premium: boolean
  vip: boolean
}

export default function ServiceComparison() {
  const features: ServiceFeature[] = [
    { name: "Collecte à domicile", standard: true, premium: true, vip: true },
    { name: "Lavage et séchage", standard: true, premium: true, vip: true },
    { name: "Repassage basique", standard: true, premium: true, vip: true },
    { name: "Repassage premium", standard: false, premium: true, vip: true },
    { name: "Traitement anti-taches", standard: false, premium: false, vip: true },
    { name: "Livraison en 48h", standard: true, premium: true, vip: false },
    { name: "Livraison en 24h", standard: false, premium: false, vip: true },
    { name: "Emballage standard", standard: true, premium: true, vip: false },
    { name: "Emballage premium", standard: false, premium: false, vip: true },
    { name: "Service prioritaire", standard: false, premium: false, vip: true },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 bg-gray-50"></th>
            <th className="p-4 bg-blue-50 text-center">
              <div className="font-bold text-gray-900">Standard</div>
              <div className="text-sm text-gray-600">25 DT / 5kg</div>
            </th>
            <th className="p-4 bg-yellow-50 text-center">
              <div className="font-bold text-gray-900">Premium</div>
              <div className="text-sm text-gray-600">45 DT / 5kg</div>
            </th>
            <th className="p-4 bg-green-50 text-center">
              <div className="font-bold text-gray-900">VIP</div>
              <div className="text-sm text-gray-600">65 DT / 5kg</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={cn("border-t border-gray-200", index % 2 === 0 ? "bg-white" : "bg-gray-50")}>
              <td className="p-4 text-sm font-medium text-gray-700">{feature.name}</td>
              <td className="p-4 text-center">
                {feature.standard ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mx-auto" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.premium ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mx-auto" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.vip ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mx-auto" />
                )}
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-200 bg-gray-50">
            <td className="p-4"></td>
            <td className="p-4 text-center">
              <button className="bg-[#0890F1] hover:bg-[#0780d8] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Choisir
              </button>
            </td>
            <td className="p-4 text-center">
              <button className="bg-[#0890F1] hover:bg-[#0780d8] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Choisir
              </button>
            </td>
            <td className="p-4 text-center">
              <button className="bg-[#0890F1] hover:bg-[#0780d8] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                Choisir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
