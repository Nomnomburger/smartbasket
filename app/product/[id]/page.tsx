"use client"

import { useParams, useRouter } from "next/navigation"
import { ProductDetails } from "@/components/product-details"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = params.id as string

  const handleClose = () => {
    router.back()
  }

  return <ProductDetails itemId={itemId} onClose={handleClose} />
}

