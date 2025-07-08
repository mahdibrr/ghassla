"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SubscriptionUsageForm() {
  const { toast } = useToast()
  const [credits, setCredits] = useState<number>(1)
  const [description, setDescription] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (credits < 1) {
      setError("Le nombre de crédits doit être supérieur à 0")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call to use credits
      await new Promise((resolve) => setTimeout(resolve, 800))
      // Simulate success
      toast({
        title: "Crédits utilisés",
        description: `${credits} crédits ont été utilisés avec succès.`,
      })
      setCredits(1)
      setDescription("")
    } catch (error) {
      console.error("Error using subscription credits:", error)
      setError("Une erreur s'est produite lors de l'utilisation des crédits")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utiliser des crédits</CardTitle>
        <CardDescription>Utilisez vos crédits d'abonnement pour des services</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="credits">Nombre de crédits</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              value={credits}
              onChange={(e) => setCredits(Number.parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-sm text-gray-500">Entrez le nombre de crédits que vous souhaitez utiliser</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez l'utilisation de ces crédits"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" className="bg-[#0890F1] hover:bg-[#0780d8]" disabled={isSubmitting || credits < 1}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                Traitement...
              </>
            ) : (
              "Utiliser les crédits"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
