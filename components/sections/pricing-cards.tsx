"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PricingCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const pricingCards = [
    {
      name: "Quick Wash",
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_big.png",
      description: "Idéal pour le linge quotidien",
      price: "25",
      unit: "DT",
      period: "par service",
      features: ["Lavage et séchage", "Pliage soigné", "Collecte et livraison", "Livraison en 48h"],
      popular: false,
      color: "bg-blue-50",
      hoverColor: "bg-blue-100",
    },
    {
      name: "Deep Clean",
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_iron_big.png",
      description: "Service complet avec repassage",
      price: "45",
      unit: "DT",
      period: "par service",
      features: ["Lavage et séchage", "Repassage inclus", "Pliage soigné", "Collecte et livraison", "Livraison en 48h"],
      popular: true,
      color: "bg-yellow-50",
      hoverColor: "bg-yellow-100",
    },
    {
      name: "VIP Laundry",
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/dry_cleaning_big.png",
      description: "Service premium personnalisé",
      price: "65",
      unit: "DT",
      period: "par service",
      features: [
        "Lavage et séchage premium",
        "Repassage soigné",
        "Traitement anti-taches",
        "Pliage et emballage premium",
        "Collecte et livraison prioritaires",
        "Livraison en 24h",
      ],
      popular: false,
      color: "bg-green-50",
      hoverColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pricingCards.map((card, index) => (
        <div
          key={card.name}
          className={cn(
            "relative rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2",
            card.color,
            hoveredCard === index ? card.hoverColor : "",
            "dark:bg-gray-800 dark:border dark:border-blue-700",
          )}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {hoveredCard === index && (
            <div className="absolute -inset-1 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bubble-animation"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          {card.popular && (
            <div className="absolute top-0 right-0 bg-[#FFD06D] text-[#0890F1] text-xs font-bold uppercase py-1 px-4 rounded-bl-lg rounded-tr-lg">
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Plus populaire
              </div>
            </div>
          )}

          <div className="flex items-center mb-4">
            <div className="w-16 h-16 mr-4">
              <Image
                src={card.icon || "/placeholder.svg"}
                alt={card.name}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{card.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{card.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#0890F1] dark:text-white">{card.price}</span>
              <span className="text-lg ml-1 text-gray-600 dark:text-gray-300">{card.unit}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.period}</p>
          </div>

          <ul className="mb-6 space-y-3">
            {card.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <Check className="h-5 w-5 text-[#0890F1] mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full bg-[#0890F1] hover:bg-[#0780d8] text-white">Choisir ce forfait</Button>
        </div>
      ))}

      <style jsx global>{`
        .bubble-animation {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(8, 144, 241, 0.2));
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.5);
          animation: bubbleFloat 3s ease-in-out infinite;
          z-index: 1;
          opacity: 0;
        }
        
        @keyframes bubbleFloat {
          0% {
            transform: translateY(20px) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-60px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
