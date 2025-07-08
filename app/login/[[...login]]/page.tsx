'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import { Heart, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn, setActive } = useSignIn()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await signIn?.create({
        identifier: email,
        password: password,
      })

      if (result?.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId })
        }
        router.push('/dashboard')
      } else {
        console.log('Login incomplet:', result)
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err)
      alert(err?.errors?.[0]?.message || 'Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#0890F1]/10 mb-4">
              <Heart className="h-8 w-8 text-[#0890F1]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connexion à votre compte</h1>
            <p className="text-gray-600 mt-2">
              Accédez à vos services de blanchisserie et gérez vos commandes
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <SignIn.Root>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="votre@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
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
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#0890F1] focus:ring-[#0890F1] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/reset-password" className="font-medium text-[#0890F1] hover:text-[#0780d8]">
                      Mot de passe oublié?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0890F1] hover:bg-[#0780d8] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Clerk.Connection name="google" asChild>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M21.35 11.1h-9.17v2.9h5.27c-.23 1.3-.9 2.4-1.92 3.1l3.1 2.4c1.81-1.7 2.87-4.2 2.87-7.2z" />
                        <path fill="#34A853" d="M12.18 21c2.6 0 4.77-.87 6.36-2.36l-3.1-2.4c-.86.58-1.97.93-3.26.93-2.5 0-4.6-1.68-5.36-3.95H3.68v2.5C5.25 18.87 8.46 21 12.18 21z" />
                        <path fill="#FBBC05" d="M6.82 13.22a5.85 5.85 0 010-3.44V7.28H3.68a8.99 8.99 0 000 9.44l3.14-2.5z" />
                        <path fill="#EA4335" d="M12.18 6.21c1.42 0 2.7.49 3.7 1.44l2.76-2.76A8.93 8.93 0 0012.18 3a8.99 8.99 0 00-8.5 6.28l3.14 2.5c.75-2.27 2.85-3.95 5.36-3.95z" />
                      </svg>
                      Continuer avec Google
                    </Button>
                  </Clerk.Connection>

                  <Clerk.Connection name="facebook" asChild>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#1877F3"
                          d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                        />
                      </svg>
                      Continuer avec Facebook
                    </Button>
                  </Clerk.Connection>
                </div>
              </div>
            </SignIn.Root>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link href="/signup" className="font-medium text-[#0890F1] hover:text-[#0780d8]">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
