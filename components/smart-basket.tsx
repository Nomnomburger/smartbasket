"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, ShoppingBasket, Plus, Search, Store, List, Minimize2, Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import testingData from "@/data/testingData.json"

interface SmartBasketProps {
  onClose: () => void
}

type ViewMode = "list" | "store"

interface ShoppingItem {
  id: string
  itemName: string
  checked: boolean
  onSale: boolean
  storeId: string
  price: string
  addedAt: string
}

export function SmartBasket({ onClose }: SmartBasketProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("store")
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [storesWithCounts, setStoresWithCounts] = useState<{ [storeId: string]: number }>({})
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    setShoppingItems(testingData.shoppingList)
    const counts = testingData.shoppingList.reduce(
      (acc, item) => {
        acc[item.storeId] = (acc[item.storeId] || 0) + 1
        return acc
      },
      {} as { [storeId: string]: number },
    )
    setStoresWithCounts(counts)
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const totalItems = shoppingItems.length
  const onSaleItems = shoppingItems.filter((item) => item.onSale).length

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
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {viewMode === "store" && selectedStore ? (
            <motion.div
              key="store-expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white mx-1 min-h-full pb-24"
              style={{ borderRadius: "32px 32px 0 0" }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=56&width=56"
                      alt={`${selectedStore} logo`}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                    <h2 className="text-2xl font-medium">{selectedStore}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[42px] w-[42px] rounded-full bg-black/5"
                    onClick={() => setSelectedStore(null)}
                  >
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="bg-[#C6E8F3] rounded-[20px] p-4 mb-6 flex justify-between items-center">
                  <div>
                    <p className="text-xl">2km away</p>
                    <p className="text-base text-gray-600">Save with public transit</p>
                  </div>
                  <div className="bg-[#16FFA6] h-[42px] w-[84px] rounded-full flex items-center justify-center">
                    <Bus className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-0">
                  {shoppingItems
                    .filter((item) => item.storeId === selectedStore)
                    .map((item, index, array) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between h-[72px]">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-full border border-[#C6E8F3] ${
                                item.checked ? "bg-[#C6E8F3]" : ""
                              }`}
                            />
                            <span className="text-base font-normal">{item.itemName}</span>
                          </div>
                          <span
                            className={`text-base font-[300] h-8 px-3 rounded-full flex items-center ${
                              item.onSale ? "bg-[#CFE6BE]" : "bg-[#D9D9D9]"
                            }`}
                          >
                            ${item.price}
                          </span>
                        </div>
                        {index < array.length - 1 && <div className="h-[1px] bg-[#C6E8F3]" />}
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="px-4 pb-24">
              <motion.div layoutId="smartbasket-content" className="mb-4">
                <h2 className="text-2xl">
                  <span className="font-[300]">{totalItems} products total</span>
                  <br />
                  <span className="font-[500]">{onSaleItems} on sale:</span>
                </h2>
              </motion.div>

              <motion.div layoutId="smartbasket-items">
                {shoppingItems
                  .filter((item) => item.onSale)
                  .map((item) => (
                    <div key={item.id} className="bg-[#CFE6BE] rounded-[20px] p-4 mb-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-medium">{item.itemName}</h3>
                          <p className="text-sm text-gray-600">{item.storeId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </motion.div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl">Shopping list</h2>
                  <div className="flex bg-white rounded-full h-[42px] w-[84px] p-0 relative">
                    <button
                      onClick={() => setViewMode("list")}
                      className="h-[42px] w-[42px] rounded-full flex items-center justify-center z-10"
                    >
                      <List className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("store")}
                      className="h-[42px] w-[42px] rounded-full flex items-center justify-center z-10"
                    >
                      <Store className="h-5 w-5" />
                    </button>
                    <div
                      className={`absolute top-0 h-[42px] w-[42px] bg-[#C6E8F3] rounded-full transition-all duration-300 ${
                        viewMode === "store" ? "left-[42px]" : "left-0"
                      }`}
                    />
                  </div>
                </div>

                {viewMode === "store" ? (
                  <motion.div
                    key="store-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-1"
                  >
                    {Object.entries(storesWithCounts).map(([storeId, count]) => (
                      <div
                        key={storeId}
                        className="bg-white rounded-[20px] p-4 cursor-pointer"
                        onClick={() => setSelectedStore(storeId)}
                      >
                        <div className="mb-8">
                          <h3 className="text-base font-medium">{storeId}</h3>
                          <p className="text-sm text-gray-600">2km away</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base">{count} items</span>
                          <Image
                            src="/placeholder.svg?height=40&width=40"
                            alt={`${storeId} logo`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-[20px] overflow-hidden"
                  >
                    {shoppingItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between p-4 h-[72px]">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-full border border-[#C6E8F3] ${
                                item.checked ? "bg-[#C6E8F3]" : ""
                              }`}
                            />
                            <span className="text-base font-normal">{item.itemName}</span>
                          </div>
                          <span
                            className={`text-xs font-[300] h-8 px-3 rounded-full flex items-center ${
                              item.onSale ? "bg-[#CFE6BE]" : "bg-black/5"
                            }`}
                          >
                            {item.storeId}
                          </span>
                        </div>
                        {index < shoppingItems.length - 1 && (
                          <div className="mx-4">
                            <div className="h-[1px] bg-[#C6E8F3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed footer */}
      {!selectedStore && (
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
      )}
    </motion.div>
  )
}

