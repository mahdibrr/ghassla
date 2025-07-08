import ScheduleForm from "@/components/schedule-form"

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0890F1] mb-6">Planifiez votre collecte</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Choisissez le moment qui vous convient le mieux pour la collecte de votre linge. Notre service est
            disponible 7j/7.
          </p>
          <div className="flex justify-center">
            <ScheduleForm />
          </div>
        </div>
      </div>
    </section>
  )
}
