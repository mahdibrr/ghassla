import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="bg-[#FFE5B0] rounded-3xl p-8 sm:p-14 md:p-20 lg:p-24">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Main content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Text */}
                <div className="max-w-2xl">
                  <h2 className="text-[#0890F1] font-bold mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                    <span className="block">Reprenez votre temps.</span>
                    <span className="block">Laissez-nous nous</span>
                    <span className="block">occuper du linge.</span>
                  </h2>

                  <Link
                    href="#process"
                    className="inline-flex items-center text-[#0890F1] hover:opacity-90 transition-opacity text-lg font-medium"
                  >
                    Comment ça fonctionne
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>

                {/* Right side - Image */}
                <div className="hidden lg:block">
                  <Image
                    src="https://img.freepik.com/free-photo/medium-shot-smiley-woman-smelling-clean-clothes_23-2148246495.jpg?t=st=1741862031~exp=1741865631~hmac=30246a9463b0ff15549a1de5124099588de386ef26155365a158688bae1966eb&w=1060"
                    alt="Happy person with clean laundry"
                    width={600}
                    height={600}
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
