"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, Minus, ChevronRight, ChevronLeft } from "lucide-react"
import { useBooking, type ServiceItem } from "@/context/booking-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Replace the scrollStep constant with:
const scrollStep = 200 // pixels to scroll on each arrow click

type CategoryType = {
  id: string
  name: string
}

const categories: CategoryType[] = [
  { id: "all", name: "Tous les services" },
  { id: "laver", name: "Laver & Sécher" },
  { id: "pressing", name: "Pressing & Repassage" },
  { id: "special", name: "Nettoyage Spécial" },
  { id: "packs", name: "Packs Mensuels" },
]

const allServices: ServiceItem[] = [
  {
    id: "special-cleaning",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/duvets_bulky_items_big.png",
    title: "Nettoyage Spécial",
    description: "Tapis, couettes, draps, rideaux et articles volumineux.",
    price: "15",
    unit: "/article",
    category: "special",
  },
  {
    id: "kilo-wash",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_big.png",
    title: "Lavage au Kilo",
    description: "Lavage, séchage et pliage par poids.",
    price: "22",
    unit: "/5kg",
    subPrice: "(44 DT /10kg)",
    category: "laver",
  },
  {
    id: "monthly-pack",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_iron_big.png",
    title: "Pack Mensuel",
    description: "4 services par mois (1 fois/semaine).",
    price: "90",
    unit: "/5kg",
    subPrice: "(160 DT /10kg)",
    category: "packs",
  },
  {
    id: "dry-cleaning",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/dry_cleaning_big.png",
    title: "Pressing",
    description: "Pour vêtements et tissus délicats.",
    price: "3",
    unit: "/article",
    category: "pressing",
  },
  {
    id: "shirt-ironing",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_iron_big.png",
    title: "Repassage Chemise",
    description: "Repassage professionnel pour chemises.",
    price: "2",
    unit: "/chemise",
    category: "pressing",
  },
  {
    id: "duvet-cleaning",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/duvets_bulky_items_big.png",
    title: "Nettoyage Couette",
    description: "Nettoyage en profondeur pour couettes et édredons.",
    price: "18",
    unit: "/couette",
    category: "special",
  },
  {
    id: "weekly-pack",
    icon: "https://prod-cdn.laundryheap.com/images/static/price_services/mobile/wash_iron_big.png",
    title: "Pack Hebdomadaire",
    description: "Service hebdomadaire pour vos besoins réguliers.",
    price: "25",
    unit: "/semaine",
    category: "packs",
  },
]

export default function ServiceSelection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { addService, selectedServices, updateQuantity, removeService } = useBooking()
  const categoriesRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollPosition = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current
      // Check if we can scroll left (not at the beginning)
      setCanScrollLeft(scrollLeft > 0)
      // Check if we can scroll right (not at the end)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10) // 10px buffer
    }
  }

  useEffect(() => {
    // Check initial scroll position after component mounts and categories render
    setTimeout(checkScrollPosition, 100)

    // Add scroll event listener
    const currentRef = categoriesRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollPosition)
    }

    // Add resize listener to recheck when window size changes
    window.addEventListener("resize", checkScrollPosition)

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollPosition)
      }
      window.removeEventListener("resize", checkScrollPosition)
    }
  }, [])

  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesRef.current) {
      const scrollAmount = direction === "right" ? scrollStep : -scrollStep
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })

      // Update arrow visibility after scrolling
      setTimeout(checkScrollPosition, 300)
    }
  }

  const filteredServices =
    selectedCategory === "all" ? allServices : allServices.filter((service) => service.category === selectedCategory)

  useEffect(() => {
    // Recheck scroll position when category changes
    setTimeout(checkScrollPosition, 100)
  }, [selectedCategory])

  // Helper function to get quantity of a service in cart
  const getServiceQuantity = (serviceId: string) => {
    const service = selectedServices.find((s) => s.id === serviceId)
    return service ? service.quantity || 0 : 0
  }

  // Helper function to handle adding a service
  const handleAddService = (service: ServiceItem) => {
    const existingQuantity = getServiceQuantity(service.id)
    if (existingQuantity > 0) {
      updateQuantity(service.id, existingQuantity + 1)
    } else {
      addService(service)
    }
  }

  // Helper function to handle removing a service
  const handleRemoveService = (serviceId: string) => {
    const existingQuantity = getServiceQuantity(serviceId)
    if (existingQuantity > 1) {
      updateQuantity(serviceId, existingQuantity - 1)
    } else {
      removeService(serviceId)
    }
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .gradient-left {
          background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
        }
        .gradient-right {
          background: linear-gradient(to left, white, rgba(255, 255, 255, 0));
        }
        /* Remove underline on accordion hover */
        .accordion-no-underline [data-state] {
          text-decoration: none !important;
        }
        .accordion-no-underline [data-state]:hover {
          text-decoration: none !important;
        }
        /* Override the default underline behavior */
        .accordion-no-underline [data-state="open"] {
          text-decoration: none !important;
        }
      `}</style>
      {/* Category selection with navigation arrows */}
      <div className="mb-6 relative">
        <div className="overflow-x-hidden">
          <div
            ref={categoriesRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-[#0890F1] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Left navigation arrow with shadow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 h-full flex items-center">
            <button
              onClick={() => scrollCategories("left")}
              className="bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-50 transition-colors ml-1"
              aria-label="Voir catégories précédentes"
            >
              <ChevronLeft className="text-[#0890F1]" size={20} />
            </button>
            <div className="h-full w-16 gradient-left pointer-events-none"></div>
          </div>
        )}

        {/* Right navigation arrow with shadow */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 h-full flex items-center">
            <div className="h-full w-16 gradient-right pointer-events-none"></div>
            <button
              onClick={() => scrollCategories("right")}
              className="bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-50 transition-colors"
              aria-label="Voir plus de catégories"
            >
              <ChevronRight className="text-[#0890F1]" size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Services accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full accordion-no-underline"
        defaultValue={categories.filter((c) => c.id !== "all")[0]?.id}
      >
        {categories
          .filter((c) => c.id !== "all")
          .map((category) => {
            const categoryServices = allServices.filter((service) => service.category === category.id)

            if (selectedCategory !== "all" && selectedCategory !== category.id) {
              return null
            }

            // Add emoji based on category
            const categoryEmoji =
              category.id === "laver"
                ? "🧼"
                : category.id === "pressing"
                  ? "👔"
                  : category.id === "special"
                    ? "✨"
                    : category.id === "packs"
                      ? "📦"
                      : "🧺"

            return (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border border-[#0890F1]/20 rounded-lg mb-3 overflow-hidden"
              >
                <AccordionTrigger className="text-[#0890F1] font-medium py-4 px-4 hover:no-underline">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{categoryEmoji}</span>
                    {category.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {categoryServices.map((service) => {
                      const quantity = getServiceQuantity(service.id)
                      const isInCart = quantity > 0

                      return (
                        <div
                          key={service.id}
                          className={`bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-300 border ${
                            isInCart ? "border-[#0890F1] shadow-sm" : "border-gray-200 hover:border-[#0890F1]/40"
                          } group relative overflow-hidden`}
                        >
                          {isInCart && <div className="absolute top-0 left-0 w-2 h-full bg-[#0890F1]"></div>}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-4xl">
                              {service.id === "special-cleaning" && "🧹"}
                              {service.id === "kilo-wash" && "👕"}
                              {service.id === "monthly-pack" && "📅"}
                              {service.id === "dry-cleaning" && "👔"}
                              {service.id === "shirt-ironing" && "🔥"}
                              {service.id === "duvet-cleaning" && "🛏️"}
                              {service.id === "weekly-pack" && "📦"}
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
                                {service.subPrice && (
                                  <span className="text-gray-500 text-sm ml-1">{service.subPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {isInCart ? (
                            <div className="flex items-center bg-gray-100 rounded-full">
                              <button
                                onClick={() => handleRemoveService(service.id)}
                                className="h-8 w-8 rounded-full flex items-center justify-center text-[#0890F1] hover:bg-[#0890F1] hover:text-white transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-6 text-center font-medium text-gray-700">{quantity}</span>
                              <button
                                onClick={() => handleAddService(service)}
                                className="h-8 w-8 rounded-full flex items-center justify-center text-[#0890F1] hover:bg-[#0890F1] hover:text-white transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddService(service)}
                              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#0890F1] group-hover:bg-[#0890F1] group-hover:text-white transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
      </Accordion>
    </div>
  )
}
