"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, Upload, Loader2, Check, AlertCircle } from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { NearbyStore } from "@/lib/useLocation"
import { addProductOffer, updateUserShoppingListWithSales } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  store: NearbyStore
}

interface AnalysisResult {
  isValidSale: boolean
  product?: string
  regularPrice?: number
  salePrice?: number
  confidence?: number
}

type ErrorType = "API_ERROR" | "PARSING_ERROR" | "INVALID_RESPONSE" | "UNKNOWN_ERROR"

export function ContributeModal({ isOpen, onClose, store }: ContributeModalProps) {
  const [image, setImage] = useState<string | null>(null)
  const [status, setStatus] = useState<"initial" | "uploading" | "processing" | "analyzing" | "success" | "error">(
    "initial",
  )
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const [user] = useAuthState(auth)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus("uploading")
      // Convert the file to base64 for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setStatus("processing")
        analyzeSaleImage(file)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error handling file:", error)
      setStatus("error")
    }
  }

  const analyzeSaleImage = async (file: File) => {
    try {
      setStatus("analyzing")

      // Initialize Gemini API
      console.log("Initializing Gemini API...")
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")
      console.log("Gemini API initialized")
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

      // Convert file to proper format for Gemini
      console.log("Converting image to GenerativePart...")
      const imageData = await fileToGenerativePart(file)
      console.log("Image converted")

      // Analyze the image
      console.log("Sending request to Gemini API...")
      const result = await model.generateContent([
        "Analyze this image. Is it a store sale? What product? What's the regular price and sale price? JSON response: {isValidSale, product, regularPrice, salePrice, confidence}",
        imageData,
      ])
      console.log("Received response from Gemini API")

      console.log("Parsing response...")
      const response = await result.response
      const responseText = response.text()
      console.log("Raw response:", responseText)
      setRawResponse(responseText)
      let analysisResult: AnalysisResult
      try {
        // Clean up the response text by removing markdown code block if present
        const jsonText = responseText.replace(/```json\n?|\n?```/g, "").trim()
        // Remove any trailing commas before closing braces or brackets
        const cleanedJsonText = jsonText.replace(/,\s*([\]}])/g, "$1")
        console.log("Cleaned JSON text:", cleanedJsonText)
        analysisResult = JSON.parse(cleanedJsonText)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        console.error("Problematic JSON string:", responseText)
        setStatus("error")
        setErrorType("PARSING_ERROR")
        return
      }
      console.log("Parsed analysis result:", analysisResult)

      setAnalysisResult(analysisResult)

      if (analysisResult.isValidSale && analysisResult.confidence && analysisResult.confidence > 0.7) {
        console.log("Valid sale detected, attempting to add product offer")
        // Add the product offer to Firestore
        if (analysisResult.product || analysisResult.regularPrice || analysisResult.salePrice) {
          console.log("Adding product offer:", {
            product: analysisResult.product,
            regularPrice: analysisResult.regularPrice,
            salePrice: analysisResult.salePrice,
            storeId: store.name,
          })
          const offerAdded = await addProductOffer(analysisResult.product, {
            onSale: true,
            regularPrice: analysisResult.regularPrice,
            salePrice: analysisResult.salePrice,
            storeId: store.name,
          })
          console.log("Product offer added:", offerAdded)

          if (offerAdded && user) {
            console.log("Updating user shopping list with sales")
            // Update the user's shopping list with the new sale information
            await updateUserShoppingListWithSales(user.uid)
            console.log("User shopping list updated")
          } else {
            console.log("Failed to add product offer or user not logged in")
          }
        } else {
          console.log("Missing required information for product offer")
        }

        setStatus("success")
      } else {
        console.log("Invalid sale or low confidence:", analysisResult)
        setStatus("error")
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      setStatus("error")
      setErrorType(error instanceof Error ? "API_ERROR" : "UNKNOWN_ERROR")
      setRawResponse(error instanceof Error ? error.message : String(error))
    }
  }

  const handleRetry = () => {
    setImage(null)
    setStatus("initial")
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const fileToGenerativePart = async (
    file: File,
  ): Promise<{
    inlineData: { data: string; mimeType: string }
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1]
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 40, stiffness: 400 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl text-[#171717]">Contribute</h2>
            <button
              onClick={onClose}
              className="h-[42px] w-[42px] rounded-full bg-black/5 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-[#171717]" />
            </button>
          </div>

          {status === "initial" && (
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-black text-white rounded-full h-[56px] text-xl"
              >
                <Camera className="h-6 w-6" />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-[#F6F5F8] text-black rounded-full h-[56px] text-xl"
              >
                <Upload className="h-6 w-6" />
                Upload Photo
              </button>
            </div>
          )}

          {(status === "uploading" || status === "processing" || status === "analyzing") && (
            <div className="flex flex-col items-center gap-4">
              {image && (
                <div className="relative w-full aspect-square rounded-[20px] overflow-hidden mb-4">
                  <img src={image || "/placeholder.svg"} alt="Sale preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
                    <span className="text-white text-xl">
                      {status === "uploading"
                        ? "Uploading photo..."
                        : status === "processing"
                          ? "Processing image..."
                          : "Analyzing sale..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-[56px] w-[56px] rounded-full bg-[#CFE6BE] flex items-center justify-center mb-2">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-center text-black">Your contribution helps others save money. Keep it up!</p>
              {/* Analysis results removed */}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-[56px] w-[56px] rounded-full bg-[#FFE5E5] flex items-center justify-center mb-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-center text-black mb-4">Sorry, that image didn't look like it had a sale</p>
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 bg-black text-white rounded-full h-[56px] w-full text-xl"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

