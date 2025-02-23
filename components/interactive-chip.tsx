"use client"

import { useState, useEffect } from "react"
import { Plus, Check } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, addShoppingItem, deleteShoppingItem } from "@/lib/firebase"
import type { ShoppingItem } from "@/lib/firebase"

interface InteractiveChipProps {
  item: string
  onAdd: (item: string) => void
  onRemove: (item: string) => void
  isAdded: boolean
  shoppingItems: ShoppingItem[]
}

export function InteractiveChip({ item, onAdd, onRemove, isAdded, shoppingItems }: InteractiveChipProps) {
  const [user] = useAuthState(auth)
  const [added, setAdded] = useState(isAdded)

  useEffect(() => {
    setAdded(isAdded)
  }, [isAdded])

  const handleClick = async () => {
    if (!user) return

    if (added) {
      const itemToRemove = shoppingItems.find((shoppingItem) => shoppingItem.itemName === item)
      if (itemToRemove) {
        await deleteShoppingItem(user.uid, itemToRemove.id)
        onRemove(item)
      }
    } else {
      const newItem = {
        itemName: item,
        checked: false,
        onSale: true,
        storeId: getRandomStore(),
        price: getRandomPrice(),
        sourceIconUrl: "",
        addedAt: new Date().toISOString(),
      }
      await addShoppingItem(user.uid, newItem)
      onAdd(item)
    }
    setAdded(!added)
  }

  return (
    <button
      className={`flex items-center gap-2 px-4 h-[42px] rounded-full whitespace-nowrap text-base ${
        added ? "bg-[#CFE6BE]" : "bg-white"
      }`}
      onClick={handleClick}
    >
      {item}
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  )
}

function getRandomStore() {
  const stores = ["Walmart", "Costco", "Loblaws", "No Frills", "Real Canadian Superstore"]
  return stores[Math.floor(Math.random() * stores.length)]
}

function getRandomPrice() {
  return (Math.random() * (10 - 1) + 1).toFixed(2)
}

