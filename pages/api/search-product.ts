import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getJson } from "serpapi"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request in search-product API")
  console.log("Request body:", req.body)

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { query } = req.body

  if (!query) {
    return res.status(400).json({ message: "Query is required" })
  }

  try {
    console.log("Starting SerpAPI request...")
    // Step 1: Fetch data from SerpApi
    const serpResult = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google_shopping",
          q: query,
          api_key: process.env.SERPAPI_KEY,
          num: 5, // Limit to top 5 results for faster processing
        },
        (data: any) => {
          if (data.error) {
            reject(new Error(data.error))
          } else {
            resolve(data)
          }
        },
      )
    })

    console.log("SerpAPI request completed")
    // Log the entire SerpAPI response
    console.log("SerpAPI Response:", JSON.stringify(serpResult, null, 2))

    if (!serpResult.shopping_results || serpResult.shopping_results.length === 0) {
      throw new Error("No shopping results found")
    }

    // Log just the shopping results
    console.log("Shopping Results:", JSON.stringify(serpResult.shopping_results, null, 2))

    console.log("Starting Gemini processing...")
    // Step 2: Process data with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      Analyze the following Google Shopping results and find the store with the lowest price for the item "${query}".
      Only consider the top 5 results. If there are sponsored results, ignore them.
      Provide the result in the following JSON format:
      {
        "itemName": "The name of the item",
        "lowestPrice": "The lowest price found (as a string with 2 decimal places)",
        "storeId": "The name of the store with the lowest price"
      }

      Here are the results:
      ${JSON.stringify(serpResult.shopping_results.slice(0, 5), null, 2)}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisResult = JSON.parse(response.text())

    console.log("Gemini processing completed")
    console.log("Analysis Result:", analysisResult)

    if (!analysisResult.itemName || !analysisResult.lowestPrice || !analysisResult.storeId) {
      throw new Error("Invalid analysis result")
    }

    res.status(200).json(analysisResult)
  } catch (error) {
    console.error("Error in search-product API:", error)
    console.error("Error stack:", error.stack)
    res.status(500).json({ message: "An error occurred while processing your request", error: error.message })
  }
}

