"use client"

import { useParams, useRouter } from "next/navigation"
import { ProductDetails } from "@/components/product-details"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, deleteShoppingItem, getUserShoppingList } from "@/lib/firebase"
import { useState, useEffect } from "react"
import type { ShoppingItem } from "@/lib/firebase"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const itemId = params.id as string

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserShoppingList(user.uid, setShoppingItems)
      return () => unsubscribe()
    }
  }, [user])

  const handleClose = () => {
    router.back()
  }

  const handleDelete = async (itemId: string) => {
    if (user) {
      await deleteShoppingItem(user.uid, itemId)
      router.push("/")
    }
  }

  const handleItemCheck = async (itemId: string, checked: boolean) => {
    // Implement item check logic here
    console.log("Item check not implemented yet", itemId, checked)
  }

  return (
    <ProductDetails
      itemId={itemId}
      onClose={handleClose}
      onItemCheck={handleItemCheck}
      onDelete={handleDelete}
      shoppingItems={shoppingItems}
    />
  )
}

