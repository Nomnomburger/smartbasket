import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getJson } from "serpapi"

export async function POST(req: Request) {
  console.log("Received request in search-product API")

  const body = await req.json()
  console.log("Request body:", body)

  const { query, city } = body

  if (!query) {
    return NextResponse.json({ message: "Query is required" }, { status: 400 })
  }

  try {
    console.log("Starting SerpAPI request...")
    // Step 1: Fetch data from SerpApi
    const serpResult = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: "google_shopping",
          q: `${query} in ${city || ""}`.trim(),
          gl: "ca", // Set Google location to Canada
          api_key: process.env.SERPAPI_KEY,
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
Analyze the following Google Shopping results for the query "${query}" in ${city || "an unknown location"}.
Find the store with the lowest price for the item.
Prioritize results from big shops like Walmart, Costco, Loblaws, and other major retailers.
Exclude online retailers like Amazon, eBay, or other e-commerce platforms.
Also exclude online delivery services like Instacart.
For grocery items, prioritize physical grocery stores or big-box stores.
Focus on physical store locations that customers can visit in person.
Provide the result in the following JSON format without any markdown formatting or code blocks:
{
  "itemName": "The name of the item",
  "lowestPrice": "The lowest price found (as a string with 2 decimal places)",
  "storeId": "The name of the store with the lowest price",
  "sourceIconUrl": "The URL of the source icon for the store with the lowest price"
}

Here are the results:
${JSON.stringify(serpResult.shopping_results, null, 2)}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let responseText = response.text()

    // Remove any markdown formatting if present
    responseText = responseText.replace(/```json\n|\n```/g, "").trim()

    console.log("Raw Gemini response:", responseText)

    let analysisResult
    try {
      analysisResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      throw new Error("Invalid response format from Gemini")
    }

    console.log("Gemini processing completed")
    console.log("Analysis Result:", analysisResult)

    if (
      !analysisResult.itemName ||
      !analysisResult.lowestPrice ||
      !analysisResult.storeId ||
      !analysisResult.sourceIconUrl
    ) {
      throw new Error("Invalid analysis result")
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error in search-product API:", error)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      {
        message: "An error occurred while processing your request",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

