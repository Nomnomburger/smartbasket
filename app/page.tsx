"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Home } from "@/components/home"
import { SmartBasket } from "@/components/smart-basket"
import { Today } from "@/components/today"
import { Points } from "@/components/points"

type ActiveView = "home" | "smartbasket" | "today" | "points"

export default function Page() {
  const [activeView, setActiveView] = useState<ActiveView>("home")

  return (
    <div className="min-h-screen bg-[#171717]">
      <AnimatePresence>
        {activeView === "home" && (
          <Home
            key="home"
            onSmartBasketClick={() => setActiveView("smartbasket")}
            onTodayClick={() => setActiveView("today")}
            onPointsClick={() => setActiveView("points")}
          />
        )}
        {activeView === "smartbasket" && <SmartBasket key="smartbasket" onClose={() => setActiveView("home")} />}
        {activeView === "today" && <Today key="today" onClose={() => setActiveView("home")} />}
        {activeView === "points" && <Points key="points" onClose={() => setActiveView("home")} />}
      </AnimatePresence>
    </div>
  )
}

