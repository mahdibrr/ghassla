"use client"

import { useState, useEffect, useRef } from "react"
import { Check } from "lucide-react"

export default function GettingStartedSection() {
  function StepsAnimation() {
    const [scrollStep, setScrollStep] = useState(0)
    const stepsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      let ticking = false
      function handleScroll() {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (!stepsRef.current) return
            const rect = stepsRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const visible = Math.min(Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0), 1)
            setScrollStep(visible)
            ticking = false
          })
          ticking = true
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Step thresholds
    const step1 = scrollStep >= 0.15
    const step2 = scrollStep >= 0.45
    const step3 = scrollStep >= 0.75
    const completedSteps = [step1, step2, step3].map((v, i) => v ? i + 1 : null).filter(Boolean) as number[]
    const activeStep = step3 ? 3 : step2 ? 2 : step1 ? 1 : 0

    // CSS for the shaky animation - updated for smoother, more subtle effect
    const shakyCss = `
      @keyframes circleShake {
        0% { transform: scale(1) rotate(0deg); }
        10% { transform: scale(1.05) rotate(-3deg); }
        20% { transform: scale(1.1) rotate(3deg); }
        30% { transform: scale(1.05) rotate(-3deg); }
        40% { transform: scale(1.02) rotate(2deg); }
        50% { transform: scale(1) rotate(0deg); }
        60% { transform: scale(1.02) rotate(-1deg); }
        70% { transform: scale(1.05) rotate(1deg); }
        80% { transform: scale(1.02) rotate(-1deg); }
        90% { transform: scale(1.01) rotate(1deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      .circle-shake {
        animation: circleShake 0.8s ease-in-out;
      }
    `

    return (
      <div ref={stepsRef} className="relative">
        <style>{shakyCss}</style>

        {/* Connecting lines container */}
        <div className="absolute left-[26px] top-7 w-2 h-[calc(100%-7rem)] bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 w-full bg-[#0890F1] transition-all duration-500 ease-in-out rounded-full"
            style={{ height: step2 ? "50%" : step1 ? `${Math.round((scrollStep-0.15)/0.3*50)}%` : "0%" }}
          />
          <div
            className="absolute top-1/2 left-0 w-full bg-[#0890F1] transition-all duration-500 ease-in-out rounded-full"
            style={{ height: step3 ? "50%" : step2 ? `${Math.round((scrollStep-0.45)/0.3*50)}%` : "0%" }}
          />
        </div>

        {/* Steps list with consistent spacing */}
        <ul className="relative z-10">
          <li className="flex pb-12 mb-12">
            <div className="relative z-10 mr-8">
              <span
                className={`flex justify-center items-center w-14 h-14 text-lg font-bold rounded-full transition-all duration-500 ${
                  activeStep >= 1 ? "bg-[#0890F1] text-white" : "bg-[#E6F4FE] text-[#0890F1]"
                } ${completedSteps.includes(1) ? "circle-shake" : ""}`}
                key={`step-1-${completedSteps.includes(1)}`}
              >
                {completedSteps.includes(1) ? <Check className="h-6 w-6" /> : "1"}
              </span>
            </div>
            <div className="max-w-xs pt-3">
              <h3 className="mb-2 text-lg font-bold text-gray-700">Planifiez votre collecte</h3>
              <p className="text-lg text-gray-500">
                Choisissez une date et une heure qui vous conviennent pour la collecte de votre linge.
              </p>
            </div>
          </li>

          <li className="flex pb-12 mb-12">
            <div className="relative z-10 mr-8">
              <span
                className={`flex justify-center items-center w-14 h-14 text-lg font-bold rounded-full transition-all duration-500 ${
                  activeStep >= 2 ? "bg-[#0890F1] text-white" : "bg-[#E6F4FE] text-[#0890F1]"
                } ${completedSteps.includes(2) ? "circle-shake" : ""}`}
                key={`step-2-${completedSteps.includes(2)}`}
              >
                {completedSteps.includes(2) ? <Check className="h-6 w-6" /> : "2"}
              </span>
            </div>
            <div className="max-w-xs pt-3">
              <h3 className="mb-2 text-lg font-bold text-gray-700">Préparez votre linge</h3>
              <p className="text-lg text-gray-500">Rassemblez vos vêtements et textiles à laver ou à nettoyer à sec.</p>
            </div>
          </li>

          <li className="flex">
            <div className="relative z-10 mr-8">
              <span
                className={`flex justify-center items-center w-14 h-14 text-lg font-bold rounded-full transition-all duration-500 ${
                  activeStep >= 3 ? "bg-[#0890F1] text-white" : "bg-[#E6F4FE] text-[#0890F1]"
                } ${completedSteps.includes(3) ? "circle-shake" : ""}`}
                key={`step-3-${completedSteps.includes(3)}`}
              >
                {completedSteps.includes(3) ? <Check className="h-6 w-6" /> : "3"}
              </span>
            </div>
            <div className="max-w-xs pt-3">
              <h3 className="mb-2 text-lg font-bold text-gray-700">Recevez votre linge propre</h3>
              <p className="text-lg text-gray-500">
                Nous vous livrons vos vêtements propres, repassés et prêts à porter dans les 48h.
              </p>
            </div>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <section id="getting-started" className="py-20 overflow-hidden bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center -mx-5">
            <div className="w-full lg:w-1/2 px-5 mb-20 lg:mb-0">
              <div className="max-w-md">
                <span className="text-lg font-bold text-[#0890F1]">Comment Commencer</span>
                <h2 className="mt-12 mb-10 text-5xl font-extrabold leading-tight text-gray-800">
                  Commencez votre expérience en toute simplicité
                </h2>
                <p className="mb-16 text-lg text-gray-600">
                  Laissez-nous prendre en charge votre linge et récupérez du temps pour vous !
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-5">
              <StepsAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
