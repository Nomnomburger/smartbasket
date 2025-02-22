"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

export function GeminiInsightCard() {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateInsight = async () => {
      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const currentTime = new Date()
        const dayOfWeek = currentTime.toLocaleString("en-US", { weekday: "long" })
        const timeOfDay =
          currentTime.getHours() < 12 ? "morning" : currentTime.getHours() < 18 ? "afternoon" : "evening"

        const prompt = `Given that it's ${dayOfWeek} ${timeOfDay}, generate a short, friendly message (max 100 characters) about what the user might be doing or planning, related to shopping or saving money. Don't mention the day or time directly in your response.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        setMessage(text.slice(0, 100)) // Ensure we don't exceed 100 characters
        setLoading(false)
      } catch (err) {
        console.error("Error generating insight:", err)
        setError("Couldn't generate insight right now. Try again later!")
        setLoading(false)
      }
    }

    generateInsight()
  }, [])

  return (
    <motion.div layoutId="gemini-insight-card" className="bg-[#16FFA6] rounded-[32px] p-4 text-black mb-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">GEMINI INSIGHT</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      ) : (
        <p className="text-xl font-[300]">{message}</p>
      )}
    </motion.div>
  )
}

