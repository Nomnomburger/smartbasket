import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const updatedData = req.body
      const filePath = path.join(process.cwd(), "data", "testingData.json")

      await fs.promises.writeFile(filePath, JSON.stringify(updatedData, null, 2))

      res.status(200).json({ message: "Shopping list updated successfully" })
    } catch (error) {
      console.error("Error updating JSON file:", error)
      res.status(500).json({ message: "Error updating shopping list" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

