"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

type LaundryItem = {
  id: string
  name: string
  icon: string
  price: number
  category: string
}

export default function AlaCarteList() {
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [activeCategory, setActiveCategory] = useState("all")

  const laundryItems: LaundryItem[] = [
    { id: "shirt", name: "Chemise", icon: "👔", price: 3, category: "vetements" },
    { id: "pants", name: "Pantalon", icon: "👖", price: 4, category: "vetements" },
    { id: "dress", name: "Robe", icon: "👗", price: 8, category: "vetements" },
    { id: "suit", name: "Costume", icon: "🕴️", price: 12, category: "vetements" },
    { id: "coat", name: "Manteau", icon: "🧥", price: 15, category: "vetements" },
    { id: "bedsheet", name: "Drap", icon: "🛏️", price: 6, category: "maison" },
    { id: "towel", name: "Serviette", icon: "🧖", price: 2, category: "maison" },
    { id: "curtain", name: "Rideau", icon: "🪟", price: 10, category: "maison" },
    { id: "blanket", name: "Couverture", icon: "🧣", price: 12, category: "maison" },
    { id: "pillow", name: "Taie d'oreiller", icon: "🛌", price: 3, category: "maison" },
    { id: "shoes", name: "Chaussures", icon: "👟", price: 15, category: "special" },
    { id: "bag", name: "Sac", icon: "👜", price: 18, category: "special" },
  ]

  const categories = [
    { id: "all", name: "Tous les articles" },
    { id: "vetements", name: "Vêtements" },
    { id: "maison", name: "Linge de maison" },
    { id: "special", name: "Articles spéciaux" },
  ]

  useEffect(() => {
    let total = 0
    Object.entries(selectedItems).forEach(([itemId, quantity]) => {
      const item = laundryItems.find((i) => i.id === itemId)
      if (item) {
        total += item.price * quantity
      }
    })
    setTotalPrice(total)
  }, [selectedItems, laundryItems])

  const addItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1
      } else {
        delete newItems[itemId]
      }
      return newItems
    })
  }

  const filteredItems =
    activeCategory === "all" ? laundryItems : laundryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-[#0890F1] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{item.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                  <p className="text-[#0890F1] font-medium">{item.price} DT</p>
                </div>
              </div>
              <div className="flex items-center">
                {selectedItems[item.id] ? (
                  <>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600"
                      onClick={() => removeItem(item.id)}
                    >
                      <Minus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                    </button>
                    <span className="mx-2 font-medium text-gray-900 dark:text-white">{selectedItems[item.id]}</span>
                  </>
                ) : null}
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0890F1] text-white"
                  onClick={() => addItem(item.id)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(selectedItems).length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-blue-50 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600 dark:text-gray-300">Total sélectionné:</p>
              <p className="text-2xl font-bold text-[#0890F1] dark:text-white">{totalPrice} DT</p>
            </div>
            <Button className="bg-[#0890F1] hover:bg-[#0780d8] text-white px-6 py-2">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Commander la sélection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
