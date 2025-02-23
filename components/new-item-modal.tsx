"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Info, Check, Loader2 } from "lucide-react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, addShoppingItem } from "@/lib/firebase"
import { useLocation } from "@/lib/useLocation"

interface NewItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (itemName: string) => void
}

export function NewItemModal({ isOpen, onClose, onAdd }: NewItemModalProps) {
  const [itemName, setItemName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user] = useAuthState(auth)
  const { city } = useLocation()

  console.log("Current city in NewItemModal:", city)

  const handleSubmit = async () => {
    if (itemName.trim() && user) {
      setIsLoading(true)
      try {
        console.log("Starting item addition process...")

        const requestBody = {
          query: itemName.trim(),
          city: city || "Unknown Location",
        }
        console.log("Request body:", requestBody)

        // Search for product info first
        console.log("Fetching product info...")
        const response = await fetch("/api/search-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to fetch product info: ${response.statusText}. Error: ${JSON.stringify(errorData)}`)
        }

        const productInfo = await response.json()
        console.log("Product info received:", productInfo)

        // Add the item to Firebase with the product info
        console.log("Adding item to Firebase with product info...")
        const newItemId = await addShoppingItem(user.uid, {
          itemName: itemName.trim(),
          checked: false,
          onSale: false,
          storeId: productInfo.storeId || "Unknown",
          price: productInfo.lowestPrice || "0.00",
          sourceIconUrl: productInfo.sourceIconUrl || "",
          addedAt: new Date().toISOString(),
        })

        if (newItemId) {
          console.log("Item added to Firebase:", newItemId)
          onAdd(itemName.trim())
          setItemName("")
          onClose()
        } else {
          throw new Error("Failed to add item to Firebase")
        }
      } catch (error) {
        console.error("Error adding item:", error)
        console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)))
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 40, stiffness: 400 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl text-black">New item</h2>
          <button
            onClick={onClose}
            className="h-[42px] w-[42px] rounded-full bg-black/5 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        <div className="bg-[#C6E8F3] rounded-[20px] p-4 mb-6">
          <div className="flex gap-4">
            <Info className="h-5 w-5 mt-1 text-black" />
            <div>
              <h3 className="text-xl mb-2 text-black">Auto price comparison</h3>
              <p className="text-[#4C4C4C]">
                We'll automatically find the best price for this item{city ? ` in ${city}` : ""} and add it to your
                shopping list!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Type something"
            className="flex-1 min-w-0 h-[72px] px-6 rounded-full bg-[#F6F5F8] text-xl font-light placeholder-gray-400 text-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit()
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!itemName.trim() || isLoading}
            className="h-[72px] w-[72px] flex-shrink-0 rounded-full bg-[#16FFA6] flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-black" />
            ) : (
              <Check className="h-5 w-5 text-black" />
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

