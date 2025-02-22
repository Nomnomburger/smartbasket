"use client"

import { motion } from "framer-motion"
import { MoreVertical, ArrowRight, Share2, Info, Plus, Search, User, Sun, ShoppingBasket, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeProps {
  onSmartBasketClick: () => void
  onTodayClick: () => void
  onPointsClick: () => void
}

export function Home({ onSmartBasketClick, onTodayClick, onPointsClick }: HomeProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen text-white p-1 max-w-md mx-auto space-y-1"
    >
      {/* Header */}
      <header className="flex justify-between items-start p-3">
        <div className="flex flex-col">
          <h1 className="text-base font-medium">Hi Winston! 😎</h1>
          <p className="text-base">Ready to save?</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
          <User className="h-6 w-6 text-black" />
        </div>
      </header>

      {/* Today's Deals Card */}
      <motion.div layoutId="today-card" className="bg-[#16FFA6] rounded-[32px] p-4 text-black">
        <div className="flex items-center justify-between mb-4">
          <motion.div layoutId="today-title" className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span className="text-sm font-medium">TODAY</span>
          </motion.div>
          <div className="flex gap-2">
            <motion.div layoutId="today-more">
              <Button variant="ghost" size="icon" className="h-[42px] w-[42px] rounded-full bg-black/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              className="h-[42px] w-[42px] rounded-full bg-black"
              onClick={onTodayClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        <motion.div layoutId="today-content">
          <h2 className="text-2xl mb-6 font-[300]">
            There are products <span className="font-[500]">on sale</span>
            <br />
            nearby you might like:
          </h2>
        </motion.div>
        <motion.div layoutId="today-items" className="flex gap-1 overflow-x-auto -mx-4 px-4 pb-2">
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
      </motion.div>

      {/* SmartBasket Card */}
      <motion.div
        layoutId="smartbasket-card"
        className="bg-[#F6F5F8] overflow-hidden text-black p-4"
        style={{
          borderRadius: "32px",
        }}
      >
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
            <Button
              variant="ghost"
              size="icon"
              className="h-[42px] w-[42px] rounded-full bg-black"
              onClick={onSmartBasketClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>

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

        {/* Bottom Actions */}
        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-2 bg-white rounded-full h-[42px] px-4 flex-1 text-base">
            <Plus className="h-5 w-5" />
            Add to list
          </button>
          <button className="flex items-center gap-2 bg-white rounded-full h-[42px] px-4 flex-1 text-base">
            <Search className="h-5 w-5" />
            Nearby items
          </button>
        </div>
      </motion.div>

      {/* Points Card */}
      <motion.div layoutId="points-card" className="bg-white rounded-[32px] p-4 text-black">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-[42px] w-[42px] rounded-full bg-black"
              onClick={onPointsClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>

        <motion.div layoutId="points-content">
          <h2 className="text-2xl mb-6">
            <span className="font-[500]">100</span> <span className="font-[300]">rewards points</span>
          </h2>

          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div className="w-1/3 h-full bg-[#CFE6BE] rounded-full"></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Level 2</span>
            <span className="text-sm text-gray-600">300 points for Level 3</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.main>
  )
}

