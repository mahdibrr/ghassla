import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function ExploreServicesSection() {
  const services = [
    {
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/duvets_bulky_items_big.png",
      title: "Nettoyage Spécial",
      description: "Tapis, couettes, draps, rideaux et articles volumineux.",
      price: "15",
      unit: "/article",
    },
    {
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_big.png",
      title: "Lavage au Kilo",
      description: "Lavage, séchage et pliage par poids.",
      price: "22",
      unit: "/5kg",
      subPrice: "(44 DT /10kg)",
    },
    {
      icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_iron_big.png",
      title: "Pack Mensuel",
      description: "4 services par mois (1 fois/semaine).",
      price: "90",
      unit: "/5kg",
      subPrice: "(160 DT /10kg)",
    },
  ]

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="bg-[#0890F1] text-white p-8 sm:p-12 rounded-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Découvrez nos services</h2>
              <p className="text-lg sm:text-xl mb-8 text-white/90">
                Vos vêtements sont traités avec le plus grand soin, recevant l'attention qu'ils méritent.
              </p>
              <Link
                href="/prix-et-services"
                className="text-white/90 hover:text-white flex items-center text-lg font-medium group"
              >
                Explorer nos tarifs
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Panel - Service List */}
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <button
                  key={service.title}
                  className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={service.icon || "/placeholder.svg"}
                        alt={service.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="mt-1">
                        <span className="text-gray-600 text-sm">à partir de </span>
                        <span className="text-[#0890F1] font-medium">
                          {service.price} DT
                          {service.unit}
                        </span>
                        {service.subPrice && <span className="text-gray-500 text-sm ml-1">{service.subPrice}</span>}
                      </div>
                      <Link
                        href="/prix-et-services"
                        className="text-[#0890F1] text-sm font-medium mt-2 inline-block hover:underline"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#0890F1] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
