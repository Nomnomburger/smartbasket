"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Info, Check } from "lucide-react"

interface NewItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (itemName: string) => void
}

export function NewItemModal({ isOpen, onClose, onAdd }: NewItemModalProps) {
  const [itemName, setItemName] = useState("")

  const handleSubmit = () => {
    if (itemName.trim()) {
      onAdd(itemName.trim())
      setItemName("")
      onClose()
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
          <h2 className="text-2xl">New item</h2>
          <button
            onClick={onClose}
            className="h-[42px] w-[42px] rounded-full bg-black/5 flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-[#C6E8F3] rounded-[20px] p-4 mb-6">
          <div className="flex gap-4">
            <Info className="h-5 w-5 mt-1" />
            <div>
              <h3 className="text-xl mb-2">Auto price comparison</h3>
              <p className="text-[#4C4C4C]">
                Pricing and best store will appear after you add this item to your shopping list!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Type something"
            className="flex-1 h-[56px] px-6 rounded-full bg-[#F6F5F8] text-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit()
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!itemName.trim()}
            className="h-[56px] w-[56px] rounded-full bg-[#16FFA6] flex items-center justify-center disabled:opacity-50"
          >
            <Check className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

