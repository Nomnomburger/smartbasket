export async function updateJsonFile(updatedData: any) {
  try {
    const response = await fetch("/api/update-shopping-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
      throw new Error("Failed to update shopping list")
    }

    console.log("Shopping list updated successfully")
  } catch (error) {
    console.error("Error updating shopping list:", error)
  }
}

