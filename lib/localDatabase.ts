import { v4 as uuidv4 } from "uuid"

export interface User {
  id: string
  name: string
  email: string
  shoppingList: ShoppingListItem[]
}

export interface ShoppingListItem {
  id: string
  itemName: string
  checked: boolean
  onSale: boolean
  storeId: string
  addedAt: Date
}

class LocalDatabase {
  private users: User[] = []

  constructor() {
    // Initialize with a dummy user and sample shopping list items
    const user = this.addUser("John Doe", "john@example.com")
    if (user) {
      this.addSampleShoppingListItems(user.id)
    }
  }

  addUser(name: string, email: string): User {
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      shoppingList: [],
    }
    this.users.push(newUser)
    return newUser
  }

  getUser(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId)
  }

  addShoppingListItem(userId: string, item: Omit<ShoppingListItem, "id" | "addedAt">): ShoppingListItem | null {
    const user = this.getUser(userId)
    if (!user) return null

    const newItem: ShoppingListItem = {
      ...item,
      id: uuidv4(),
      addedAt: new Date(),
    }
    user.shoppingList.push(newItem)
    return newItem
  }

  getShoppingList(userId: string): ShoppingListItem[] {
    const user = this.getUser(userId)
    return user ? user.shoppingList.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()) : []
  }

  getStoresWithItemCounts(userId: string): { [storeId: string]: number } {
    const shoppingList = this.getShoppingList(userId)
    return shoppingList.reduce(
      (acc, item) => {
        acc[item.storeId] = (acc[item.storeId] || 0) + 1
        return acc
      },
      {} as { [storeId: string]: number },
    )
  }

  private addSampleShoppingListItems(userId: string) {
    const sampleItems: Omit<ShoppingListItem, "id" | "addedAt">[] = [
      { itemName: "Milk", checked: false, onSale: true, storeId: "Walmart" },
      { itemName: "Bread", checked: false, onSale: false, storeId: "Walmart" },
      { itemName: "Eggs", checked: true, onSale: false, storeId: "Costco" },
      { itemName: "Cheese", checked: false, onSale: true, storeId: "Costco" },
      { itemName: "Apples", checked: false, onSale: false, storeId: "Whole Foods" },
      { itemName: "Bananas", checked: true, onSale: true, storeId: "Whole Foods" },
      { itemName: "Chicken", checked: false, onSale: false, storeId: "Walmart" },
      { itemName: "Rice", checked: false, onSale: false, storeId: "Costco" },
      { itemName: "Pasta", checked: true, onSale: true, storeId: "Walmart" },
      { itemName: "Tomatoes", checked: false, onSale: false, storeId: "Whole Foods" },
    ]

    sampleItems.forEach((item) => this.addShoppingListItem(userId, item))
  }
}

export const localDB = new LocalDatabase()

