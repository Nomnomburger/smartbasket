"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Home } from "@/components/home"
import { SmartBasket } from "@/components/smart-basket"
import { Today } from "@/components/today"
import { Points } from "@/components/points"
import { ProductDetails } from "@/components/product-details"
import { SignIn } from "@/components/sign-in"
import testingData from "@/data/testingData.json"
import { updateJsonFile } from "@/utils/updateJsonFile"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { Loader2 } from "lucide-react"

type ActiveView = "home" | "smartbasket" | "today" | "points" | "product"

interface ShoppingItem {
  id: string
  itemName: string
  checked: boolean
  onSale: boolean
  storeId: string
  price: string
  addedAt: string
}

export default function Page() {
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [viewStack, setViewStack] = useState<ActiveView[]>(["home"])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    const sortedItems = [...testingData.shoppingList].sort((a, b) => {
      if (a.checked === b.checked) return 0
      return a.checked ? 1 : -1
    })
    setShoppingItems(sortedItems)
  }, [])

  const navigateTo = (view: ActiveView, productId?: string) => {
    setActiveView(view)
    setViewStack((prevStack) => [...prevStack, view])
    if (productId) {
      setSelectedProductId(productId)
    }
  }

  const navigateBack = () => {
    if (viewStack.length > 1) {
      const newStack = [...viewStack]
      newStack.pop()
      setViewStack(newStack)
      setActiveView(newStack[newStack.length - 1])
      if (newStack[newStack.length - 1] !== "product") {
        setSelectedProductId(null)
      }
    }
  }

  const handleItemCheck = async (itemId: string, checked: boolean) => {
    const updatedItems = shoppingItems
      .map((item) => (item.id === itemId ? { ...item, checked } : item))
      .sort((a, b) => {
        if (a.checked === b.checked) return 0
        return a.checked ? 1 : -1
      })
    setShoppingItems(updatedItems)

    const updatedData = { ...testingData, shoppingList: updatedItems }
    await updateJsonFile(updatedData)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#171717] text-white gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#171717] text-white">
        <p>Error: {error.message}</p>
      </div>
    )
  }

  if (!user) {
    return <SignIn onSignIn={() => {}} />
  }

  return (
    <div className="min-h-screen bg-[#171717]">
      <AnimatePresence initial={false} mode="popLayout">
        {activeView === "home" && (
          <Home
            key="home"
            onSmartBasketClick={() => navigateTo("smartbasket")}
            onTodayClick={() => navigateTo("today")}
            onPointsClick={() => navigateTo("points")}
            onProductClick={(productId) => navigateTo("product", productId)}
            shoppingItems={shoppingItems}
            user={user}
            onSignOut={handleSignOut}
          />
        )}
        {activeView === "smartbasket" && (
          <SmartBasket
            key="smartbasket"
            onClose={navigateBack}
            onProductClick={(productId) => navigateTo("product", productId)}
            shoppingItems={shoppingItems}
            onItemCheck={handleItemCheck}
          />
        )}
        {activeView === "today" && <Today key="today" onClose={navigateBack} />}
        {activeView === "points" && <Points key="points" onClose={navigateBack} />}
        {activeView === "product" && selectedProductId && (
          <ProductDetails
            key="product"
            itemId={selectedProductId}
            onClose={navigateBack}
            onItemCheck={handleItemCheck}
            shoppingItems={shoppingItems}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

