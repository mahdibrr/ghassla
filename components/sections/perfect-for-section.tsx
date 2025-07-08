"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Building2, Briefcase, Heart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PerfectForSection() {
  const [activeCard, setActiveCard] = useState<"families" | "businesses" | "professionals" | "you">("families")

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
            Nos services adaptés à vos besoins
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Perfect For Lists */}
            <div className="space-y-4">
              {/* Families Card */}
              <div
                className={`rounded-xl p-6 space-y-4 cursor-pointer transition-all duration-300 ${
                  activeCard === "families" ? "bg-[#FFE5B0]" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveCard("families")}
              >
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#0890F1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">PARFAIT POUR</p>
                    <h3 className="text-xl font-semibold text-gray-900">Familles</h3>
                  </div>
                </div>
                {activeCard === "families" && (
                  <>
                    <p className="text-lg text-gray-800 animate-fadeIn">
                      Passez du temps avec vos proches, pas à faire la lessive, et nous traiterons vos vêtements comme
                      s'ils étaient les nôtres.
                    </p>
                    <Button className="bg-[#0890F1] hover:bg-[#0890F1]/90 animate-fadeIn">Réserver maintenant</Button>
                  </>
                )}
              </div>

              {/* Businesses Card */}
              <div
                className={`rounded-xl p-6 space-y-4 cursor-pointer transition-all duration-300 ${
                  activeCard === "businesses" ? "bg-[#FFE5B0]" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveCard("businesses")}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-[#0890F1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">PARFAIT POUR</p>
                    <h3 className="text-xl font-semibold text-gray-900">Entreprises</h3>
                  </div>
                </div>
                {activeCard === "businesses" && (
                  <>
                    <p className="text-lg text-gray-800 animate-fadeIn">
                      Assurez le bon fonctionnement de votre entreprise grâce à nos services de blanchisserie fiables et
                      adaptés.
                    </p>
                    <Button className="bg-[#0890F1] hover:bg-[#0890F1]/90 animate-fadeIn">Nous contacter</Button>
                  </>
                )}
              </div>

              {/* Professionals Card */}
              <div
                className={`rounded-xl p-6 space-y-4 cursor-pointer transition-all duration-300 ${
                  activeCard === "professionals" ? "bg-[#FFE5B0]" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveCard("professionals")}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-[#0890F1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">PARFAIT POUR</p>
                    <h3 className="text-xl font-semibold text-gray-900">Professionnels</h3>
                  </div>
                </div>
                {activeCard === "professionals" && (
                  <>
                    <p className="text-lg text-gray-800 animate-fadeIn">
                      Concentrez-vous sur votre carrière pendant que nous prenons soin de votre garde-robe avec nos
                      services de nettoyage premium.
                    </p>
                    <Button className="bg-[#0890F1] hover:bg-[#0890F1]/90 animate-fadeIn">En savoir plus</Button>
                  </>
                )}
              </div>

              {/* You Card */}
              <div
                className={`rounded-xl p-6 space-y-4 cursor-pointer transition-all duration-300 ${
                  activeCard === "you" ? "bg-[#FFE5B0]" : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => setActiveCard("you")}
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-[#0890F1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">PARFAIT POUR</p>
                    <h3 className="text-xl font-semibold text-gray-900">Vous</h3>
                  </div>
                </div>
                {activeCard === "you" && (
                  <>
                    <p className="text-lg text-gray-800 animate-fadeIn">
                      Profitez de plus de temps libre et de vêtements parfaitement propres grâce à notre service de
                      blanchisserie personnalisé.
                    </p>
                    <Button className="bg-[#0890F1] hover:bg-[#0890F1]/90 animate-fadeIn">Commencer</Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Text */}
            <div className="bg-[#0890F1] text-white p-8 sm:p-12 rounded-2xl flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Profitez d'une vie sans corvées. Concentrez-vous sur ce que vous aimez.
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-white/90">
                Laissez-nous prendre en charge vos tâches de blanchisserie pour que vous puissiez vous concentrer sur ce
                qui compte vraiment.
              </p>
              <Link
                href="/prix-et-services"
                className="text-white/90 hover:text-white flex items-center text-lg font-medium group"
              >
                Découvrir nos services
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
