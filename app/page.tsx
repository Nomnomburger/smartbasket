"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Home } from "@/components/home"
import { SmartBasket } from "@/components/smart-basket"
import { Today } from "@/components/today"
import { Points } from "@/components/points"
import { ProductDetails } from "@/components/product-details"
import { SignIn } from "@/components/sign-in"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, getUserShoppingList, updateShoppingItem, deleteShoppingItem, type ShoppingItem } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { Loader2 } from "lucide-react"

type ActiveView = "home" | "smartbasket" | "today" | "points" | "product"

export default function Page() {
  const [activeView, setActiveView] = useState<ActiveView>("home")
  const [viewStack, setViewStack] = useState<ActiveView[]>(["home"])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserShoppingList(user.uid, (items) => {
        const sortedItems = items.sort((a, b) => {
          if (a.checked === b.checked) return 0
          return a.checked ? 1 : -1
        })
        setShoppingItems(sortedItems)
      })

      return () => unsubscribe()
    }
  }, [user])

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
      setSelectedProductId(null)
    }
  }

  const handleItemCheck = async (itemId: string, checked: boolean) => {
    if (user) {
      await updateShoppingItem(user.uid, itemId, { checked })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (user) {
      await deleteShoppingItem(user.uid, itemId)
      navigateBack()
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
            onDelete={handleDelete}
            shoppingItems={shoppingItems}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

