"use client"

import { useState } from 'react'
import { Heart, Mail, Lock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useSignUp, useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { signUp } = useSignUp()
  const { toast } = useToast()
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser();
  const { setActive } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      setErrorMessage("Vous devez accepter les conditions d'utilisation.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const result = await signUp?.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        redirectUrl: '/dashboard',
      })
      // Save phone in Clerk public metadata after signup using TS API route
      if (result?.status === 'complete' && result.createdUserId) {
        const metadataReq = {
          userId: result.createdUserId,
          phone,
        };
        console.log('Sending metadata to Clerk:', metadataReq);
        await fetch('/api/clerk/set-user-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metadataReq),
        })
        await setActive({ session: result.createdSessionId })
        toast({
          title: 'Compte créé avec succès',
          description: 'Votre compte a été créé. Vous êtes maintenant connecté.',
        })
        router.push('/dashboard')
        return
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setErrorMessage(
        err?.errors?.[0]?.message || 'Une erreur s’est produite lors de la création du compte.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (isSignedIn) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Redirection vers le dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#0890F1]/10 mb-4">
              <Heart className="h-8 w-8 text-[#0890F1]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
            <p className="text-gray-600 mt-2">Rejoignez 8assla et simplifiez votre lessive</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{errorMessage}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700 block">
                    Prénom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="firstName"
                      type="text"
                      className="pl-10"
                      placeholder="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700 block">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
                  Téléphone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500">Le mot de passe doit contenir au moins 8 caractères</p>
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-[#0890F1] border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  J'accepte les{" "}
                  <a href="#" className="text-[#0890F1] hover:text-[#0780d8] font-medium">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-[#0890F1] hover:text-[#0780d8] font-medium">
                    politique de confidentialité
                  </a>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0890F1] hover:bg-[#0780d8] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  'Créer un compte'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
