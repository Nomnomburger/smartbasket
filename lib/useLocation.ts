"use client"

import { useState, useEffect } from "react"
import { findNearbyStores, type Store } from "./stores"

export interface Location {
  latitude: number
  longitude: number
}

export interface NearbyStore extends Store {
  distance: number
}

export function useLocation(maxDistance = 2) {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    const success = (position: GeolocationPosition) => {
      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setLocation(newLocation)
      updateNearbyStores(newLocation)
    }

    const error = () => {
      setError("Unable to retrieve your location")
    }

    navigator.geolocation.getCurrentPosition(success, error)
  }, [])

  const updateNearbyStores = (location: Location) => {
    const stores = findNearbyStores(location.latitude, location.longitude, maxDistance)
    setNearbyStores(stores as NearbyStore[])
  }

  return { location, error, nearbyStores }
}

