import Navbar from "@/components/navbar"
import HeroSection from "@/components/sections/hero-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import ExploreServicesSection from "@/components/sections/explore-services-section"
import PerfectForSection from "@/components/sections/perfect-for-section"
import ScheduleSection from "@/components/sections/schedule-section"
import GettingStartedSection from "@/components/sections/getting-started-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ExploreServicesSection />
        <PerfectForSection />
        <ScheduleSection />
        <GettingStartedSection />
      </main>
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">8assla</h3>
              <p className="text-gray-600 text-sm">
                Service de laverie et pressing à domicile à Tunis. Collecte, lavage et livraison en 48h.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Lavage
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Repassage
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Pressing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Nettoyage spécial
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#0890F1]">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
            <p>© 2023 8assla. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
