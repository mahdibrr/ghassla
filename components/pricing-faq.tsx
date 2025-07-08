"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PricingFAQ() {
  const faqs = [
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
    {
      question: "Comment sont traités les vêtements délicats ?",
      answer:
        "Les vêtements délicats sont traités avec un soin particulier selon les instructions d'entretien de chaque article. Nous utilisons des produits spécifiques et des techniques adaptées pour préserver la qualité de vos textiles.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
          <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline hover:text-[#0890F1]">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
