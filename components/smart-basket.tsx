"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, ShoppingBasket, Plus, Search, Store, List, Minimize2, Bus } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { addShoppingItem, type ShoppingItem } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { NewItemModal } from "./new-item-modal"

interface SmartBasketProps {
  onClose: () => void
  onProductClick: (productId: string) => void
  shoppingItems: ShoppingItem[]
  onItemCheck: (itemId: string, checked: boolean) => void
}

type ViewMode = "list" | "store"

export function SmartBasket({ onClose, onProductClick, shoppingItems, onItemCheck }: SmartBasketProps) {
  const [user] = useAuthState(auth)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("smartBasketViewMode")
      return (savedView as ViewMode) || "store"
    }
    return "store"
  })
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [storesWithCounts, setStoresWithCounts] = useState<{ [storeId: string]: number }>({})
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    updateStoreCounts(shoppingItems)
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [shoppingItems])

  useEffect(() => {
    localStorage.setItem("smartBasketViewMode", viewMode)
  }, [viewMode])

  const updateStoreCounts = (items: ShoppingItem[]) => {
    const counts = items.reduce(
      (acc, item) => {
        if (!item.checked) {
          acc[item.storeId] = (acc[item.storeId] || 0) + 1
        }
        return acc
      },
      {} as { [storeId: string]: number },
    )
    setStoresWithCounts(counts)
  }

  const toggleItemCheck = (itemId: string) => {
    const item = shoppingItems.find((item) => item.id === itemId)
    if (item) {
      onItemCheck(itemId, !item.checked)
    }
  }

  const handleAddItem = async (itemName: string) => {
    if (user) {
      const newItem: Omit<ShoppingItem, "id"> = {
        itemName,
        checked: false,
        onSale: false,
        storeId: "Unknown",
        price: "0.00",
        addedAt: new Date().toISOString(),
      }
      await addShoppingItem(user.uid, newItem)
    }
  }

  const uncheckedItems = shoppingItems.filter((item) => !item.checked)
  const checkedItems = shoppingItems.filter((item) => item.checked)
  const totalUncheckedItems = uncheckedItems.length
  const onSaleItems = uncheckedItems.filter((item) => item.onSale).length

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
              <button className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center">
                <Share2 className="h-5 w-5" />
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
                  <button
                    className="h-[42px] w-[42px] rounded-full bg-black/5 flex items-center justify-center"
                    onClick={() => setSelectedStore(null)}
                  >
                    <Minimize2 className="h-5 w-5" />
                  </button>
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
                      <div key={item.id} className="cursor-pointer" onClick={() => onProductClick(item.id)}>
                        <div className="flex items-center justify-between h-[72px]">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-full border-2 border-[#C6E8F3] ${
                                item.checked ? "bg-[#C6E8F3]" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleItemCheck(item.id)
                              }}
                            />
                            <span className="text-base font-normal">{item.itemName}</span>
                          </div>
                          <span
                            className={`text-base font-[300] h-8 px-3 rounded-full flex items-center ${
                              item.onSale && !item.checked ? "bg-[#CFE6BE]" : "bg-[#D9D9D9]"
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
                  <span className="font-[300]">
                    {totalUncheckedItems === 0 ? "Nothing on your list" : `${totalUncheckedItems} products total`}
                  </span>
                  <br />
                  <span className="font-[500]">
                    {onSaleItems === 0 ? "Nothing on sale" : `${onSaleItems} on sale:`}
                  </span>
                </h2>
              </motion.div>

              <motion.div layoutId="smartbasket-items">
                {uncheckedItems
                  .filter((item) => item.onSale)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#CFE6BE] rounded-[20px] p-4 mb-1 cursor-pointer"
                      onClick={() => onProductClick(item.id)}
                    >
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
                      className={`h-[42px] w-[42px] rounded-full flex items-center justify-center z-10 ${
                        viewMode === "list" ? "text-black" : "text-gray-500"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("store")}
                      className={`h-[42px] w-[42px] rounded-full flex items-center justify-center z-10 ${
                        viewMode === "store" ? "text-black" : "text-gray-500"
                      }`}
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
                  <>
                    <motion.div
                      key="list-view-unchecked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white rounded-[20px] overflow-hidden mb-4"
                    >
                      {uncheckedItems.map((item, index) => (
                        <div key={item.id} className="cursor-pointer" onClick={() => onProductClick(item.id)}>
                          <div className="flex items-center justify-between p-4 h-[72px]">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-8 w-8 rounded-full border-2 border-[#C6E8F3] ${
                                  item.checked ? "bg-[#C6E8F3]" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleItemCheck(item.id)
                                }}
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
                          {index < uncheckedItems.length - 1 && (
                            <div className="mx-4">
                              <div className="h-[1px] bg-[#C6E8F3]" />
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                    {checkedItems.length > 0 && (
                      <motion.div
                        key="list-view-checked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-[20px] overflow-hidden"
                      >
                        {checkedItems.map((item, index) => (
                          <div key={item.id} className="cursor-pointer" onClick={() => onProductClick(item.id)}>
                            <div className="flex items-center justify-between p-4 h-[72px]">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-8 w-8 rounded-full border-2 border-[#C6E8F3] ${
                                    item.checked ? "bg-[#C6E8F3]" : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleItemCheck(item.id)
                                  }}
                                />
                                <span className="text-base font-normal line-through">{item.itemName}</span>
                              </div>
                              <span className="text-xs font-[300] h-8 px-3 rounded-full flex items-center bg-black/5">
                                {item.storeId}
                              </span>
                            </div>
                            {index < checkedItems.length - 1 && (
                              <div className="mx-4">
                                <div className="h-[1px] bg-[#C6E8F3]" />
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </>
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
            <button
              onClick={() => setIsNewItemModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-black text-white rounded-full h-[42px] px-4 flex-1 text-base"
            >
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

      <AnimatePresence>
        <NewItemModal isOpen={isNewItemModalOpen} onClose={() => setIsNewItemModalOpen(false)} onAdd={handleAddItem} />
      </AnimatePresence>
    </motion.div>
  )
}

