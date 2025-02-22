import type React from "react"
import type { Metadata } from "next"
import { Onest } from "next/font/google"
import "./globals.css"

const onest = Onest({
  subsets: ["latin"],
  weight: ["300", "500", "400"], // Light, Medium, and Regular
  variable: "--font-onest",
})

export const metadata: Metadata = {
  title: "SmartBasket App",
  description: "Your smart shopping companion",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${onest.variable} font-sans`}>{children}</body>
    </html>
  )
}

