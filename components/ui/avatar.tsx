"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

// Enhanced Avatar component with improved visual cues and interactions
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    showStatus?: boolean
    status?: "online" | "offline" | "away"
    size?: "sm" | "md" | "lg" | "xl"
  }
>(({ className, showStatus, status = "online", size = "md", ...props }, ref) => {
  // Size mappings
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10 md:h-11 md:w-11",
    lg: "h-12 w-12 md:h-14 md:w-14",
    xl: "h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24",
  }

  return (
    <div className="relative group">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          "border-2 border-white dark:border-gray-800",
          "shadow-sm hover:shadow-md",
          "transition-all duration-300 ease-in-out",
          "hover:scale-105",
          "cursor-pointer",
          "bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800",
          className,
        )}
        {...props}
      />

      {/* Pulsating ring effect on hover */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 rounded-full border-2 border-[#0890F1] animate-pulse"></span>
      </span>

      {/* Status indicator */}
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800",
            size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-3.5 w-3.5",
            status === "online" ? "bg-green-500" : status === "away" ? "bg-yellow-500" : "bg-gray-400",
          )}
        />
      )}
    </div>
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

// Enhanced AvatarImage with fade-in effect and better loading handling for Supabase images
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  return (
    <AvatarPrimitive.Image
      ref={ref}
      onLoadingStatusChange={(status) => {
        setIsLoaded(status === "loaded")
        setHasError(status === "error")
      }}
      className={cn(
        "aspect-square h-full w-full",
        "object-cover",
        "transition-opacity duration-500 ease-in-out",
        isLoaded ? "opacity-100" : "opacity-0",
        hasError ? "hidden" : "block",
        className,
      )}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// Enhanced AvatarFallback with gradient background and better initials display
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    delayMs?: number
  }
>(({ className, children, delayMs = 600, ...props }, ref) => {
  const [isShown, setIsShown] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsShown(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  if (!isShown) {
    return null
  }

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        "bg-gradient-to-br from-[#0890F1] to-[#0780d8]",
        "text-lg font-medium text-white",
        "animate-in fade-in duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

const AvatarDropdown = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { show: boolean }>(
  ({ className, show, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-full mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg",
        "transition-all duration-300 ease-in-out origin-top-right z-50",
        "backdrop-blur-sm bg-white/95 dark:bg-gray-800/95",
        "border border-gray-200 dark:border-gray-700",
        show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
AvatarDropdown.displayName = "AvatarDropdown"

const ImageUpload = () => {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      setPreviewImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Here you can add your own upload logic if needed
    setIsUploading(true)
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès! (simulation)",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de l'image",
        variant: "destructive",
      })
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  return <input type="file" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
}

export { Avatar, AvatarImage, AvatarFallback, AvatarDropdown, ImageUpload }
