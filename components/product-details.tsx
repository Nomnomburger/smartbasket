"use client"

import { motion } from "framer-motion"
import { X, Trash, Package } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface ProductDetailsProps {
  itemId: string
  onClose: () => void
  onItemCheck: (itemId: string, checked: boolean) => void
  onDelete: (itemId: string) => void
  shoppingItems: ShoppingItem[]
}

interface ShoppingItem {
  id: string
  itemName: string
  checked: boolean
  onSale: boolean
  storeId: string
  price: string
  addedAt: string
}

interface StoreAvailability {
  storeId: string
  distance: string
  price: string
  onSale: boolean
  logo: string
}

export function ProductDetails({ itemId, onClose, onItemCheck, onDelete, shoppingItems }: ProductDetailsProps) {
  const item = shoppingItems.find((item) => item.id === itemId)

  // Simulated nearby stores data - in real implementation, this would come from the database
  const nearbyStores: StoreAvailability[] = [
    {
      storeId: item?.storeId || "Walmart",
      distance: "2km away",
      price: item?.price || "2.00",
      onSale: item?.onSale || false,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      storeId: "No Frills",
      distance: "1km away",
      price: "2.99",
      onSale: false,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      storeId: "Loblaws",
      distance: "4km away",
      price: "3.00",
      onSale: false,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      storeId: "Costco",
      distance: "6km away",
      price: "1.49",
      onSale: true,
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const toggleItemCheck = () => {
    if (item) {
      onItemCheck(item.id, !item.checked)
    }
  }

  if (!item) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#C6E8F3] text-black overflow-hidden flex flex-col"
    >
      {/* Fixed header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">ITEM</span>
          </div>
          <div className="flex gap-2">
            <button
              className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center"
              onClick={() => {
                if (item) {
                  onDelete(item.id)
                  onClose() // This will trigger navigateBack in the parent component
                }
              }}
            >
              <Trash className="h-5 w-5" />
            </button>
            <button
              className="h-[42px] w-[42px] rounded-full bg-black flex items-center justify-center"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`h-8 w-8 rounded-full border-2 border-[#4C4C4C] ${item.checked ? "bg-[#4C4C4C]" : ""}`}
            onClick={toggleItemCheck}
          />
          <h1 className="text-2xl font-normal">{item.itemName}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {nearbyStores.map((store) => (
            <div
              key={store.storeId}
              className={`relative rounded-[20px] p-4 ${store.storeId === item.storeId ? "bg-[#16FFA6]" : "bg-white"}`}
            >
              {store.onSale && !item.checked && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#CFE6BE]" />
              )}
              <div className="mb-8">
                <h3 className="text-base font-medium">{store.storeId}</h3>
                <p className="text-sm text-gray-600">{store.distance}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl">${store.storeId === item.storeId ? item.price : store.price}</span>
                <Image
                  src={store.logo || "/placeholder.svg"}
                  alt={`${store.storeId} logo`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

