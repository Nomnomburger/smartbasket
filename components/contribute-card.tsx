"use client"

import { motion } from "framer-motion"
import { Link, MoreVertical, MapPin, Camera, Frown } from "lucide-react"
import { useState } from "react"
import { ContributeModal } from "./contribute-modal"
import type { NearbyStore } from "@/lib/useLocation"

interface ContributeCardProps {
  store: NearbyStore
  onStoreSelect?: (store: NearbyStore) => void
  onContribute: () => void
}

export function ContributeCard({ store, onStoreSelect, onContribute }: ContributeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleYesClick = () => {
    if (onStoreSelect) {
      onStoreSelect(store)
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.div layoutId={`contribute-card-${store.id}`} className="bg-[#CFE6BE] rounded-[32px] p-4 text-black mb-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            <span className="text-sm font-medium">CONTRIBUTE</span>
          </div>
          <div className="flex gap-2">
            <button className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center">
              <MoreVertical className="h-5 w-5" />
            </button>
            <button className="h-[42px] w-[42px] rounded-full bg-black/10 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl mb-1">
            See anything on sale at <span className="font-medium">{store.name}?</span>
          </h2>
          <p className="text-[#4C4C4C]">{store.distance.toFixed(1)}km away</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleYesClick}
            className="flex items-center justify-center gap-2 bg-black text-white rounded-full h-[42px] px-4 flex-1"
          >
            <Camera className="h-5 w-5" />
            Yes!
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-black rounded-full h-[42px] px-4 flex-1">
            <Frown className="h-5 w-5" />
            Nope
          </button>
        </div>
      </motion.div>

      <ContributeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          onContribute()
        }}
        store={store}
      />
    </>
  )
}

