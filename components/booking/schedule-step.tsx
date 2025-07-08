"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { useBooking } from "@/context/booking-context"

const timeSlots = [
	{ id: 1, time: "08:00 - 10:00", available: true },
	{ id: 2, time: "10:00 - 12:00", available: true },
	{ id: 3, time: "12:00 - 14:00", available: true },
	{ id: 4, time: "14:00 - 16:00", available: true },
	{ id: 5, time: "16:00 - 18:00", available: true },
	{ id: 6, time: "18:00 - 20:00", available: true },
]

export default function ScheduleStep() {
	const { scheduledDate, setScheduledDate, scheduledTimeSlot, setScheduledTimeSlot } = useBooking();
	const [location, setLocation] = useState("Tunis")

	// Compute available slots based on selected date and current time
	const now = new Date();
	const isToday = scheduledDate &&
		now.toDateString() === new Date(scheduledDate).toDateString();

	function isSlotInPast(slotTime: string) {
		if (!isToday) return false;
		const [start] = slotTime.split(" - ");
		const [startHour, startMin] = start.split(":").map(Number);
		const slotStart = new Date(now);
		slotStart.setHours(startHour, startMin, 0, 0);
		return now >= slotStart;
	}

	return (
		<div className="bg-white rounded-xl p-6 shadow-sm">
			<h2 className="text-xl font-bold text-gray-900 mb-6">Planifiez votre collecte</h2>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Left side - Calendar */}
				<div className="flex-1">
					<h3 className="text-lg font-medium text-gray-700 mb-4">Sélectionnez une date</h3>
					<div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
						<DayPicker
							mode="single"
							selected={scheduledDate}
							onSelect={setScheduledDate}
							fromDate={new Date(new Date().setHours(0,0,0,0))}
							modifiersClassNames={{
								selected: "bg-[#0890F1] text-white font-bold",
								today: "border-2 border-[#0890F1] text-[#0890F1] font-bold",
								disabled: "opacity-40 cursor-not-allowed"
							}}
							disabled={{ before: new Date(new Date().setHours(0,0,0,0)) }}
							className="w-full"
							styles={{
								caption: { color: "#0890F1", fontWeight: 600 },
								head_cell: { color: "#0890F1" },
								day_selected: { backgroundColor: "#0890F1", color: "#fff" },
								day_today: { borderColor: "#0890F1", color: "#0890F1" },
							}}
						/>
					</div>
				</div>

				{/* Right side - Time slots */}
				<div className="flex-1">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-medium text-gray-700">Choisissez un créneau horaire</h3>
						<div className="flex items-center text-sm text-gray-500">
							<MapPin size={14} className="mr-1" />
							{location}
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{timeSlots.map((slot) => {
							const disabled = !slot.available || !scheduledDate || isSlotInPast(slot.time);
							return (
								<button
									key={slot.id}
									onClick={() => !disabled && setScheduledTimeSlot(slot.time)}
									disabled={disabled}
									className={`p-3 rounded-lg border flex items-center transition-colors ${
										scheduledTimeSlot === slot.time
											? "border-[#0890F1] bg-blue-50"
										: !disabled
										? "border-gray-200 hover:border-[#0890F1]"
										: "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
									}`}
								>
									<Clock size={16} className={scheduledTimeSlot === slot.time ? "text-[#0890F1]" : "text-gray-400"} />
									<span
										className={`ml-2 ${scheduledTimeSlot === slot.time ? "text-[#0890F1] font-medium" : "text-gray-700"}`}
									>
										{slot.time}
									</span>
								</button>
						);
						})}
					</div>

					<div className="mt-6 text-sm text-gray-500">
						<p>* Les créneaux horaires sont sujets à disponibilité</p>
						<p>* La livraison sera effectuée dans les 48h après la collecte</p>
					</div>
				</div>
			</div>
		</div>
	)
}
