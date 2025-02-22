"use client"

import { motion } from "framer-motion"
import { X, Info, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface PointsProps {
  onClose: () => void
}

export function Points({ onClose }: PointsProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <motion.div layoutId="points-card" className="fixed inset-0 bg-white text-black overflow-hidden flex flex-col">
      {/* Fixed header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div layoutId="points-title" className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            <span className="text-sm font-medium">POINTS</span>
          </motion.div>
          <div className="flex gap-2">
            <motion.div layoutId="points-info">
              <Button variant="ghost" size="icon" className="h-[42px] w-[42px] rounded-full bg-black/10">
                <Info className="h-5 w-5" />
              </Button>
            </motion.div>
            <Button variant="ghost" size="icon" className="h-[42px] w-[42px] rounded-full bg-black" onClick={onClose}>
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        <motion.div layoutId="points-content">
          <h2 className="text-2xl font-medium mb-6">100 rewards points</h2>

          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div className="w-1/3 h-full bg-[#CFE6BE] rounded-full"></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Level 2</span>
            <span className="text-sm text-gray-600">300 points for Level 3</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

