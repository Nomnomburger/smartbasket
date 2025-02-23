import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
} from "firebase/firestore"
// Add these imports at the top of the file
import { addDoc, where, getDocs, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

const db = getFirestore(app)

export { auth, db }

// Firestore utility functions
export const getUserShoppingList = (userId: string, callback: (items: ShoppingItem[]) => void) => {
  const q = query(collection(db, "Users", userId, "ShoppingList"))
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ShoppingItem)
    callback(items)
  })
}

export const addShoppingItem = async (userId: string, item: Omit<ShoppingItem, "id">): Promise<string | null> => {
  try {
    console.log("Adding shopping item:", item)
    const newItemRef = doc(collection(db, "Users", userId, "ShoppingList"))
    await setDoc(newItemRef, item)
    console.log("Shopping item added successfully, ID:", newItemRef.id)
    return newItemRef.id
  } catch (error) {
    console.error("Error adding shopping item:", error)
    return null
  }
}

export const updateShoppingItem = async (userId: string, itemId: string, updates: Partial<ShoppingItem>) => {
  const itemRef = doc(db, "Users", userId, "ShoppingList", itemId)
  await updateDoc(itemRef, updates)
}

export const deleteShoppingItem = async (userId: string, itemId: string) => {
  const itemRef = doc(db, "Users", userId, "ShoppingList", itemId)
  await deleteDoc(itemRef)
}

// Types
export interface ShoppingItem {
  id: string
  itemName: string
  checked: boolean
  onSale: boolean
  storeId: string
  price: string
  addedAt: string
  sourceIconUrl: string // Add this new field
}

export const updateProductInfo = async (
  userId: string,
  itemId: string,
  updates: Partial<ShoppingItem>,
): Promise<void> => {
  try {
    console.log("Updating product info:", { userId, itemId, updates })
    const itemRef = doc(db, "Users", userId, "ShoppingList", itemId)
    await updateDoc(itemRef, updates)
    console.log("Product info updated successfully")
  } catch (error) {
    console.error("Error updating product info:", error)
    throw error
  }
}

// Add these new functions at the end of the file

export const addProductOffer = async (
  productName: string,
  offer: {
    onSale: boolean
    regularPrice: number
    salePrice: number
    storeId: string
  },
) => {
  try {
    console.log("Adding product offer for:", productName)
    // Check if the product already exists
    const productsRef = collection(db, "Products")
    const q = query(productsRef, where("name", "==", productName))
    const querySnapshot = await getDocs(q)

    let productId: string

    if (querySnapshot.empty) {
      console.log("Product doesn't exist, creating new product")
      // If the product doesn't exist, create a new one
      const newProductRef = await addDoc(productsRef, { name: productName })
      productId = newProductRef.id
      console.log("New product created with ID:", productId)
    } else {
      // If the product exists, use its ID
      productId = querySnapshot.docs[0].id
      console.log("Existing product found with ID:", productId)
    }

    // Add the offer to the Offers subcollection
    console.log("Adding offer to Offers subcollection")
    const offersRef = collection(db, "Products", productId, "Offers")
    const newOfferRef = await addDoc(offersRef, {
      ...offer,
      updatedAt: serverTimestamp(),
    })
    console.log("Offer added with ID:", newOfferRef.id)

    console.log("Product offer added successfully")
    return true
  } catch (error) {
    console.error("Error adding product offer:", error)
    return false
  }
}

export const updateUserShoppingListWithSales = async (userId: string) => {
  try {
    console.log("Updating user shopping list with sales for user:", userId)
    const userShoppingListRef = collection(db, "Users", userId, "ShoppingList")
    const userShoppingListSnapshot = await getDocs(userShoppingListRef)

    console.log("Number of items in user's shopping list:", userShoppingListSnapshot.size)

    const batch = writeBatch(db)
    let updatesMade = false

    for (const doc of userShoppingListSnapshot.docs) {
      const item = doc.data() as ShoppingItem
      console.log("Checking item:", item.itemName)
      const productsRef = collection(db, "Products")
      const q = query(productsRef, where("name", "==", item.itemName))
      const productSnapshot = await getDocs(q)

      if (!productSnapshot.empty) {
        console.log("Matching product found in Products collection")
        const productId = productSnapshot.docs[0].id
        const offersRef = collection(db, "Products", productId, "Offers")
        const offersSnapshot = await getDocs(offersRef)

        console.log("Number of offers found:", offersSnapshot.size)

        let bestOffer: any = null

        offersSnapshot.forEach((offerDoc) => {
          const offer = offerDoc.data()
          if (offer.onSale && (!bestOffer || offer.salePrice < bestOffer.salePrice)) {
            bestOffer = offer
          }
        })

        if (bestOffer && (!item.price || bestOffer.salePrice < Number.parseFloat(item.price))) {
          console.log("Updating item with best offer:", bestOffer)
          batch.update(doc.ref, {
            onSale: true,
            price: bestOffer.salePrice.toFixed(2),
            storeId: bestOffer.storeId,
          })
          updatesMade = true
        } else {
          console.log("No better offer found for this item")
        }
      } else {
        console.log("No matching product found in Products collection")
      }
    }

    if (updatesMade) {
      await batch.commit()
      console.log("Batch update committed successfully")
    } else {
      console.log("No updates were necessary")
    }

    console.log("User shopping list update completed")
  } catch (error) {
    console.error("Error updating user shopping list with sales:", error)
  }
}

