"use client"

import { motion } from "framer-motion"
import { X, MoreVertical, Plus, Sun } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface TodayProps {
  onClose: () => void
}

export function Today({ onClose }: TodayProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <motion.div layoutId="today-card" className="fixed inset-0 bg-[#16FFA6] text-black overflow-hidden flex flex-col">
      {/* Fixed header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div layoutId="today-title" className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span className="text-sm font-medium">TODAY</span>
          </motion.div>
          <div className="flex gap-2">
            <motion.div layoutId="today-more">
              <button className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center">
                <MoreVertical className="h-5 w-5" />
              </button>
            </motion.div>
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
        <motion.div layoutId="today-content" className="mb-8">
          <h2 className="text-2xl font-[300]">
            There are products <span className="font-[500]">on sale</span>
            <br />
            nearby you might like:
          </h2>
        </motion.div>

        <motion.div layoutId="today-items" className="flex gap-1 overflow-x-auto -mx-4 px-4">
          {["Yogurt", "Apples", "Chips", "Oranges"].map((item) => (
            <button
              key={item}
              className="flex items-center gap-2 bg-white text-black px-4 h-[42px] rounded-full whitespace-nowrap text-base"
            >
              {item}
              <Plus className="h-4 w-4" />
            </button>
          ))}
        </motion.div>

        <div className="mt-8">
          <h2 className="text-2xl mb-4">Stores with sales</h2>
          <div className="grid grid-cols-2 gap-1 pb-6">
            {[
              { name: "Walmart", distance: "2km away", items: 3, logo: "/placeholder.svg?height=40&width=40" },
              { name: "No Frills", distance: "1km away", items: 2, logo: "/placeholder.svg?height=40&width=40" },
              { name: "Loblaws", distance: "4km away", items: 1, logo: "/placeholder.svg?height=40&width=40" },
              { name: "Costco", distance: "6km away", items: 3, logo: "/placeholder.svg?height=40&width=40" },
              { name: "Loblaws", distance: "4km away", items: 1, logo: "/placeholder.svg?height=40&width=40" },
              { name: "Costco", distance: "6km away", items: 3, logo: "/placeholder.svg?height=40&width=40" },
            ].map((store) => (
              <div key={store.name} className="bg-white rounded-[20px] p-4">
                <div className="mb-8">
                  <h3 className="text-base font-medium">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.distance}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base">{store.items} items</span>
                  <Image
                    src={store.logo || "/placeholder.svg"}
                    alt={`${store.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

