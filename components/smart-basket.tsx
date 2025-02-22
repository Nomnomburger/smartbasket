"use client"

import { motion } from "framer-motion"
import { X, Share2, ShoppingBasket, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect } from "react"

interface SmartBasketProps {
  onClose: () => void
}

export function SmartBasket({ onClose }: SmartBasketProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <motion.div
      layoutId="smartbasket-card"
      className="fixed inset-0 bg-[#F6F5F8] text-black overflow-hidden flex flex-col"
    >
      {/* Fixed header */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div layoutId="smartbasket-title" className="flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5" />
            <span className="text-sm font-medium">YOUR SMARTBASKET</span>
          </motion.div>
          <div className="flex gap-2">
            <motion.div layoutId="smartbasket-share">
              <Button variant="ghost" size="icon" className="h-[42px] w-[42px] rounded-full bg-black/10">
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>
            <Button variant="ghost" size="icon" className="h-[42px] w-[42px] rounded-full bg-black" onClick={onClose}>
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <motion.div layoutId="smartbasket-content" className="mb-4">
          <h2 className="text-2xl">
            <span className="font-[300]">12 products total</span>
            <br />
            <span className="font-[500]">2 on sale:</span>
          </h2>
        </motion.div>

        <motion.div layoutId="smartbasket-items">
          {[
            { name: "Granola bars", price: "$2" },
            { name: "KitKat", price: "$1.99" },
          ].map((item) => (
            <div key={item.name} className="bg-[#CFE6BE] rounded-[20px] p-4 mb-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Walmart - 2km away</p>
                </div>
                <span className="text-base">{item.price}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Shopping list</h2>
            <div className="flex gap-2">
              <button className="h-[42px] w-[42px] rounded-full bg-white flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H21M3 12H21M3 18H21" stroke="black" strokeWidth="2" />
                </svg>
              </button>
              <button className="h-[42px] w-[42px] rounded-full bg-[#C6E8F3] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 11.5C21 16.75 12 21.25 12 21.25C12 21.25 3 16.75 3 11.5C3 9.51088 3.79018 7.60322 5.1967 6.1967C6.60322 4.79018 8.51088 4 10.5 4C12 4 13.5 4.5 14.5 5.25C15.5 4.5 17 4 18.5 4C20.4891 4 22.3968 4.79018 23.8033 6.1967C25.2098 7.60322 26 9.51088 26 11.5Z"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-24">
            {[
              { name: "Walmart", distance: "2km away", items: 3, logo: "/placeholder.svg?height=40&width=40" },
              { name: "No Frills", distance: "1km away", items: 2, logo: "/placeholder.svg?height=40&width=40" },
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

      {/* Fixed footer */}
      <div className="px-4 py-6 bg-[#F6F5F8] fixed bottom-0 left-0 right-0">
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 bg-black text-white rounded-full h-[42px] px-4 flex-1 text-base">
            <Plus className="h-5 w-5" />
            Add to list
          </button>
          <button className="flex items-center justify-center gap-2 bg-[#16FFA6] rounded-full h-[42px] px-4 flex-1 text-base">
            <Search className="h-5 w-5" />
            Nearby items
          </button>
        </div>
      </div>
    </motion.div>
  )
}

