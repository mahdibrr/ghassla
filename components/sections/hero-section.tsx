"use client"

import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-[#0890F1]">
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        {/* Component */}
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-20 lg:grid-cols-2">
          {/* Heading Content */}
          <div className="max-w-[720px]">
            <h1 className="mb-3 pb-4 text-4xl font-bold text-white md:text-6xl">
              Service de laverie & pressing en 48h à <span className="text-[#FFD06D]">Tunis</span>
            </h1>
            <p className="mb-6 max-w-[528px] text-xl md:mb-10 text-white/90">
              Nous collectons, lavons et livrons votre linge propre et repassé directement à votre porte.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="bg-white hover:opacity-90 text-[#0890F1] font-medium px-6 py-3 rounded-md transition-colors text-sm flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Planifier une collecte
              </button>
              <button
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="border border-white text-white hover:opacity-90 font-medium px-6 py-3 rounded-md transition-colors text-sm flex items-center"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Image Div - Hidden on mobile and md screens */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-full max-w-[700px] lg:max-w-none">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgg-abaBbfS1yFy074GGAclDaGgy1On2Bq.png"
                alt="Stack of neatly folded blue and white towels"
                width={800}
                height={640}
                className="w-full h-auto object-contain"
                priority
                style={{ maxHeight: "80vh" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
