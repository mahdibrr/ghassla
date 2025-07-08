"use client"

import { useUser } from "@clerk/nextjs"
import { useState, useRef, useEffect } from "react"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfileForm() {
  const { user } = useUser()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    address: user?.publicMetadata?.address as string || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch phone and address from Clerk public metadata on mount or user change
  useEffect(() => {
    async function fetchMeta() {
      if (user?.id) {
        const res = await fetch(`/api/clerk/set-user-metadata?userId=${encodeURIComponent(user.id)}`)
        if (res.ok) {
          const data = await res.json()
          setFormData((prev) => ({
            ...prev,
            phone: (data.phone as string) || "",
            address: (data.address as string) || "",
          }))
        } else {
          if (user.publicMetadata?.phone) {
            setFormData((prev) => ({ ...prev, phone: user.publicMetadata.phone as string }))
          }
          if (user.publicMetadata?.address) {
            setFormData((prev) => ({ ...prev, address: user.publicMetadata.address as string }))
          }
        }
      }
    }
    fetchMeta()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 2 Mo",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image valide",
          variant: "destructive",
        })
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreviewImage(result)
      }
      reader.readAsDataURL(file)

      // Update Clerk profile image
      try {
        setIsSubmitting(true)
        await user?.setProfileImage({ file })
        toast({
          title: "Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la photo de profil.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide"
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)
    try {
      await user?.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      if (formData.email && formData.email !== user?.emailAddresses?.[0]?.emailAddress) {
        await user?.createEmailAddress({ email: formData.email })
      }
      // Always update phone and address in Clerk public metadata
      if (user?.id) {
        await fetch('/api/clerk/set-user-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, phone: formData.phone, address: formData.address }),
        })
      }
      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès.",
      })
    } catch (error: any) {
      if (
        error?.errors?.[0]?.code === "form_identifier_verification_required" ||
        error?.message?.includes("additional verification")
      ) {
        toast({
          title: "Vérification requise",
          description: "Veuillez vérifier votre numéro de téléphone avant de le modifier. Un lien de vérification a été envoyé si nécessaire.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la mise à jour du profil",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          {previewImage ? (
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              {/* Placeholder icon */}
              <span>?</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-[#0890F1] text-white p-1.5 rounded-full shadow-md"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Photo de profil</h3>
          <p className="text-sm text-gray-500 mb-2">JPG, PNG ou GIF. 2MB maximum.</p>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" size="sm" onClick={handleImageClick}>
              Changer la photo
            </Button>
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Prénom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Nom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+216 XX XXX XXX"
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        <p className="text-xs text-gray-500">
          Nous utilisons votre numéro uniquement pour les notifications de livraison
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse <span className="text-red-500">*</span></Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="Votre adresse complète"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800">
          Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
        </AlertDescription>
      </Alert>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            // Reset form to original user data
            if (user) {
              setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.emailAddresses?.[0]?.emailAddress || "",
                phone: "",
                address: user.publicMetadata?.address as string || "",
              })
              setPreviewImage(null)
              setErrors({})
            }
          }}
        >
          Annuler
        </Button>
        <Button type="submit" className="bg-[#0890F1] hover:bg-[#0780d8]" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </form>
  )
}
