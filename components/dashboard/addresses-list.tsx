"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Home, Building, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Address = {
  id: string
  street: string
  city: string
  postalCode: string
  isDefault: boolean
}

export default function AddressesList({ addresses }: { addresses: Address[] }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
  })

  const handleAddAddress = () => {
    // In a real app, this would call an API to add the address
    setIsAddDialogOpen(false)
    setNewAddress({
      street: "",
      city: "",
      postalCode: "",
    })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Vos adresses</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0890F1] hover:bg-[#0780d8]">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une adresse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle adresse</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle adresse pour la collecte et la livraison de votre linge.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="street" className="text-sm font-medium text-gray-700 block">
                  Rue et numéro
                </label>
                <input
                  id="street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700 block">
                    Ville
                  </label>
                  <input
                    id="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="text-sm font-medium text-gray-700 block">
                    Code postal
                  </label>
                  <input
                    id="postalCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0890F1]"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[#0890F1] hover:bg-[#0780d8]" onClick={handleAddAddress}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                address.isDefault ? "border-[#0890F1] bg-blue-50" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  {address.isDefault ? (
                    <Home className="h-5 w-5 text-[#0890F1] mr-2" />
                  ) : (
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <h3 className="font-medium text-gray-900">
                    {address.isDefault ? "Adresse par défaut" : "Adresse secondaire"}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-[#0890F1]">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-gray-600">
                <p>{address.street}</p>
                <p>
                  {address.postalCode} {address.city}
                </p>
              </div>
              {!address.isDefault && (
                <Button variant="outline" size="sm" className="mt-3">
                  Définir par défaut
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune adresse enregistrée</h3>
          <p className="text-gray-500 mb-4">
            Ajoutez une adresse pour faciliter la collecte et la livraison de votre linge.
          </p>
          <Button className="bg-[#0890F1] hover:bg-[#0780d8]">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </Button>
        </div>
      )}
    </div>
  )
}
