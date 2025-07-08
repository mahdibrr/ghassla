"use client"

import { useState } from "react"
import { ChevronRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScheduleForm() {
  const [location, setLocation] = useState("Tunis")

  return (
    <div className="bg-white rounded-xl p-6 text-gray-800 w-full max-w-3xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#0890F1]" />
          <p className="font-medium text-gray-800 text-base">Planifiez votre collecte dans {location}</p>
        </div>
        <button
          className="text-[#0890F1] font-medium hover:underline text-sm flex items-center"
          onClick={() => {
            /* Handle change location */
          }}
        >
          Changer
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="mb-6">
        <div className="border border-gray-300 rounded-lg p-4 hover:border-[#0890F1] hover:shadow-md cursor-pointer transition-all duration-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-[#0890F1] mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="text-gray-500 text-sm font-medium">HORAIRE DISPONIBLE</p>
                <p className="font-semibold text-base text-gray-800">12:00 - 15:00</p>
              </div>
            </div>
            <ChevronRight className="text-[#0890F1] flex-shrink-0" size={18} />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button className="bg-[#0890F1] hover:bg-[#0890F1]/90 text-white px-8 py-2 rounded-md transition-colors">
          Suivant
        </Button>
      </div>
    </div>
  )
}
