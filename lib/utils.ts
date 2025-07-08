import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date with optional days to add
 * Handles null, undefined, and invalid dates
 */
export function formatDate(dateInput: string | Date | null | undefined, daysToAdd = 0): string {
  if (!dateInput) {
    return "Date non disponible"
  }

  const date = new Date(dateInput)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Date invalide"
  }

  // Add days if specified
  if (daysToAdd !== 0) {
    date.setDate(date.getDate() + daysToAdd)
  }

  // Format the date in French locale
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Generates a unique key for navigation items
 */
export function generateUniqueKey(path: string, index: number): string {
  return `nav-item-${path.replace(/\//g, "-")}-${index}`
}
