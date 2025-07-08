"use client"

import { useState } from "react"
import { BookingProvider } from "@/context/booking-context"
import BookingSteps from "@/components/booking/booking-steps"
import OrderSummary from "@/components/booking/order-summary"
import Navbar from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Clock, Truck, Heart } from "lucide-react"
import ServicePacks from "@/components/service-packs"
import AlaCarteList from "@/components/sections/a-la-carte-list"
import SubscriptionPlans from "@/components/sections/subscription-plans"
import BubblesAnimation from "@/components/ui/bubbles-animation"

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("packs")

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0890F1] to-[#0780d8] py-16 md:py-24 overflow-hidden">
        <BubblesAnimation />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-10">
              <path
                fill="#ffffff"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-4">
              Prix et Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Des services adaptés à tous vos besoins</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Découvrez nos formules flexibles pour prendre soin de votre linge avec professionnalisme et efficacité.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-[#0890F1] hover:bg-white/90 px-6 py-2">Voir nos tarifs</Button>
              <Button variant="outline" className="bg-white text-[#0890F1] hover:bg-white/90 px-6 py-2">
                Comment ça marche
              </Button>
            </div>
          </div>
        </div>
      </section>

      
      {/* Booking System */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Réservez votre service</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Planifiez votre collecte en quelques clics et laissez-nous prendre soin de votre linge.
              </p>
            </div>
            <BookingProvider>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <BookingSteps />
                </div>
                <div>
                  <OrderSummary />
                </div>
              </div>
            </BookingProvider>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Comment ça marche</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un processus simple en trois étapes pour vous faciliter la vie.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#0890F1] text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Planifiez</h3>
                  <p className="text-gray-600">
                    Choisissez une date et une heure qui vous conviennent pour la collecte de votre linge.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#0890F1] text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nous collectons</h3>
                  <p className="text-gray-600">Notre équipe vient chercher votre linge directement à votre domicile.</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#0890F1] text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nous livrons</h3>
                  <p className="text-gray-600">Votre linge propre et repassé est livré à votre porte dans les 48h.</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-10">
              <Button className="bg-[#0890F1] hover:bg-[#0780d8] text-white px-8">Réserver maintenant</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">Pourquoi choisir 8assla?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-[#0890F1]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Qualité Premium</h3>
                <p className="text-sm text-gray-600">
                  Nous utilisons des produits de haute qualité pour prendre soin de vos vêtements.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[#0890F1]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Livraison Rapide</h3>
                <p className="text-sm text-gray-600">Votre linge propre livré en 48h après la collecte.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-[#0890F1]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Service à Domicile</h3>
                <p className="text-sm text-gray-600">Collecte et livraison directement chez vous.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-[#0890F1]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Satisfaction Garantie</h3>
                <p className="text-sm text-gray-600">Nous nous engageons à vous offrir un service impeccable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Questions fréquentes</h2>
              <p className="text-gray-600">Tout ce que vous devez savoir sur nos services de blanchisserie.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Quels sont les délais de livraison ?",
                  answer:
                    "Notre délai de livraison standard est de 48h après la collecte. Un service express avec livraison en 24h est également disponible moyennant un supplément.",
                },
                {
                  question: "Comment sont calculés les tarifs ?",
                  answer:
                    "Nos tarifs sont calculés en fonction du poids pour les services au kilo, et à l'unité pour les articles spécifiques. Vous pouvez consulter nos grilles tarifaires détaillées sur cette page.",
                },
                {
                  question: "Quelles zones desservez-vous ?",
                  answer:
                    "Nous desservons actuellement toute la région de Tunis et ses environs. Contactez-nous pour vérifier si votre adresse est dans notre zone de service.",
                },
                {
                  question: "Comment puis-je payer ?",
                  answer:
                    "Nous acceptons les paiements par carte bancaire en ligne, ainsi que les paiements en espèces à la livraison.",
                },
                {
                  question: "Puis-je annuler ma commande ?",
                  answer: "Oui, vous pouvez annuler gratuitement jusqu'à 2 heures avant l'heure de collecte prévue.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-600 mb-4">Vous avez d'autres questions ?</p>
              <Button variant="outline" className="border-[#0890F1] text-[#0890F1] hover:bg-[#0890F1] hover:text-white">
                Contactez-nous
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0890F1] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à nous confier votre linge ?</h2>
            <p className="text-xl opacity-90 mb-8">
              Rejoignez les milliers de clients satisfaits qui nous font confiance chaque jour
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white hover:bg-gray-100 text-[#0890F1] px-8 py-6 text-lg">
                Réserver maintenant
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-[#0780d8] px-8 py-6 text-lg">
                Voir les abonnements
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
