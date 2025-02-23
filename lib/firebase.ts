import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query } from "firebase/firestore"

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

