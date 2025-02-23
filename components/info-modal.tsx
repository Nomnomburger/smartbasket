"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Info } from "lucide-react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  header: string
  description: string
}

export function InfoModal({ isOpen, onClose, header, description }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
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
            <h2 className="text-2xl text-[#171717]">{header}</h2>
            <button
              onClick={onClose}
              className="h-[42px] w-[42px] rounded-full bg-black/5 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-[#171717]" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="h-[56px] w-[56px] rounded-full bg-[#F6F5F8] flex items-center justify-center mb-2">
              <Info className="h-6 w-6 text-[#171717]" />
            </div>
            <p className="text-center text-black">{description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

