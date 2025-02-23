"use client"

import { motion } from "framer-motion"
import { MoreVertical, ArrowRight, Share2, Info, Plus, Search, User, Sun, ShoppingBasket, Tag } from "lucide-react"
import type { User as FirebaseUser } from "firebase/auth"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useLocation } from "@/lib/useLocation"
import { ContributeCard } from "./contribute-card"
import { GeminiInsightCard } from "./gemini-insight-card"
import type { NearbyStore } from "@/lib/useLocation"
import { NewItemModal } from "./new-item-modal"
import { addShoppingItem } from "@/lib/firebase"
import { InfoModal } from "./info-modal"
import { InteractiveChip } from "./interactive-chip"
import { getUserShoppingList } from "@/lib/firebase"

interface HomeProps {
  onSmartBasketClick: () => void
  onTodayClick: () => void
  onPointsClick: () => void
  onProductClick: (productId: string) => void
  shoppingItems: ShoppingItem[]
  user: FirebaseUser | null
  onSignOut: () => void
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

export function Home({
  onSmartBasketClick,
  onTodayClick,
  onPointsClick,
  onProductClick,
  shoppingItems,
  user,
  onSignOut,
}: HomeProps) {
  const uncheckedItems = shoppingItems.filter((item) => !item.checked)
  const onSaleItems = uncheckedItems.filter((item) => item.onSale)
  const [showSignOutPopup, setShowSignOutPopup] = useState(false)
  const { nearbyStores, error: locationError } = useLocation(0.5) // 0.5km radius
  const [selectedStore, setSelectedStore] = useState<NearbyStore | null>(null)
  const [dismissedStores, setDismissedStores] = useState<string[]>([])
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isPointsInfoModalOpen, setIsPointsInfoModalOpen] = useState(false)
  const [isNearbyItemsModalOpen, setIsNearbyItemsModalOpen] = useState(false)
  const [isTodayOptionsModalOpen, setIsTodayOptionsModalOpen] = useState(false)
  const [todayItems, setTodayItems] = useState<ShoppingItem[]>([])

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserShoppingList(user.uid, (items) => {
        setTodayItems(items.filter((item) => item.onSale))
      })
      return () => unsubscribe()
    }
  }, [user])

  const handleAddItem = async (itemName: string) => {
    if (user) {
      try {
        await addShoppingItem(user.uid, {
          itemName,
          checked: false,
          onSale: false,
          storeId: "Unknown",
          price: "0.00",
          sourceIconUrl: "",
          addedAt: new Date().toISOString(),
        })
        // Note: The shopping list will be automatically updated through the Firebase listener in the parent component
      } catch (error) {
        console.error("Error adding new item:", error)
        // You might want to show an error message to the user here
      }
    }
  }

  const handleDismissStore = (storeId: string) => {
    setDismissedStores((prev) => [...prev, storeId])
  }

  const suggestedItems = [
    "Yogurt",
    "Apples",
    "Chips",
    "Oranges",
    "Bread",
    "Milk",
    "Eggs",
    "Cheese",
    "Bananas",
    "Chicken",
    "Pasta",
    "Tomatoes",
    "Cereal",
    "Coffee",
    "Carrots",
    "Lettuce",
  ]

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
          <h1 className="text-base font-medium">Hi {user?.displayName?.split(" ")[0] || "there"}! 😎</h1>
          <p className="text-base">Ready to save?</p>
        </div>
        <div className="relative">
          <button
            className="h-12 w-12 rounded-full bg-white flex items-center justify-center overflow-hidden"
            onClick={() => setShowSignOutPopup(!showSignOutPopup)}
          >
            {user?.photoURL ? (
              <Image
                src={user.photoURL || "/placeholder.svg"}
                alt="Profile"
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-[#171717]" />
            )}
          </button>
          {showSignOutPopup && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <p className="px-4 py-2 text-sm text-[#4c4c4c]">{user?.displayName}</p>
              <button
                onClick={onSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-[#4c4c4c] hover:bg-[#c6e8f3]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Location Error Message */}
      {locationError && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-[20px] mx-1 mb-1">
          <p>{locationError}</p>
        </div>
      )}

      {/* Contribute Cards - show for each nearby store */}
      {nearbyStores
        .filter((store) => !dismissedStores.includes(store.id))
        .map((store) => (
          <ContributeCard
            key={store.id}
            store={store}
            onStoreSelect={setSelectedStore}
            onContribute={() => handleDismissStore(store.id)}
            onDismiss={() => handleDismissStore(store.id)}
          />
        ))}

      {/* Today's Deals Card */}
      <motion.div layoutId="today-card" className="bg-[#16FFA6] rounded-[32px] p-4 text-black">
        <div className="flex items-center justify-between mb-4">
          <motion.div layoutId="today-title" className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span className="text-sm font-medium">TODAY</span>
          </motion.div>
          <div className="flex gap-2">
            <motion.div layoutId="today-more">
              <button
                className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center"
                onClick={() => setIsTodayOptionsModalOpen(true)}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </motion.div>
            <button
              className="h-[42px] w-[42px] rounded-full bg-black flex items-center justify-center"
              onClick={onTodayClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
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
          {suggestedItems.map((item) => (
            <InteractiveChip
              key={item}
              item={item}
              onAdd={(item) => console.log(`Added ${item} to shopping list`)}
              onRemove={(item) => console.log(`Removed ${item} from shopping list`)}
              isAdded={todayItems.some((todayItem) => todayItem.itemName === item)}
              shoppingItems={todayItems}
            />
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
              <button
                className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="h-5 w-5" />
              </button>
            </motion.div>
            <button
              className="h-[42px] w-[42px] rounded-full bg-black flex items-center justify-center"
              onClick={onSmartBasketClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <motion.div layoutId="smartbasket-content" className="mb-4">
          <h2 className="text-2xl">
            <span className="font-[300]">
              {uncheckedItems.length === 0 ? "Nothing on your list" : `${uncheckedItems.length} products total`}
            </span>
            <br />
            <span className="font-[500]">
              {onSaleItems.length === 0 ? "Nothing on sale" : `${onSaleItems.length} on sale:`}
            </span>
          </h2>
        </motion.div>

        <motion.div layoutId="smartbasket-items">
          {onSaleItems.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-[#CFE6BE] rounded-[20px] p-4 mb-1 cursor-pointer"
              onClick={() => onProductClick(item.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">{item.storeId} - 2km away</p>
                </div>
                <span className="text-base">${item.price}</span>
              </div>
            </div>
          ))}
          {onSaleItems.length > 2 && (
            <div className="bg-[#C6E8F3] rounded-[20px] p-4 mb-1 cursor-pointer" onClick={onSmartBasketClick}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">+ {onSaleItems.length - 2} more</h3>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom Actions */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex items-center justify-center gap-2 bg-white rounded-full h-[42px] px-4 flex-1 text-base"
            onClick={() => setIsNewItemModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add to list
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-white rounded-full h-[42px] px-4 flex-1 text-base"
            onClick={() => setIsNearbyItemsModalOpen(true)}
          >
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
              <button
                className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center"
                onClick={() => setIsPointsInfoModalOpen(true)}
              >
                <Info className="h-5 w-5" />
              </button>
            </motion.div>
            <button
              className="h-[42px] w-[42px] rounded-full bg-black flex items-center justify-center"
              onClick={onPointsClick}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
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

      {/* Gemini Insight Card */}
      <GeminiInsightCard />

      {/* New Item Modal */}
      <NewItemModal isOpen={isNewItemModalOpen} onClose={() => setIsNewItemModalOpen(false)} onAdd={handleAddItem} />

      {/* Info Modals */}
      <InfoModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        header="Share basket"
        description="Basket sharing is coming soon - Winston"
      />
      <InfoModal
        isOpen={isPointsInfoModalOpen}
        onClose={() => setIsPointsInfoModalOpen(false)}
        header="Rewards info"
        description="Earn rewards by helping crowdsource data. Redeemable rewards are coming soon!"
      />
      <InfoModal
        isOpen={isNearbyItemsModalOpen}
        onClose={() => setIsNearbyItemsModalOpen(false)}
        header="Nearby items"
        description="Finding nearby items is coming soon - Winston"
      />
      <InfoModal
        isOpen={isTodayOptionsModalOpen}
        onClose={() => setIsTodayOptionsModalOpen(false)}
        header="Options"
        description="Some options will be available soon - Winston"
      />
    </motion.main>
  )
}

