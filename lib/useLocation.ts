"use client"

import { useState, useEffect } from "react"
import { type Store, findNearbyStores } from "./stores"

interface Location {
  latitude: number
  longitude: number
}

export interface NearbyStore extends Store {
  distance: number
}

export function useLocation(maxDistance = 2) {
  const [location, setLocation] = useState<Location | null>(null)
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let watchId: number

    const success = (position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setLocation(newLocation)

      // Find nearby stores
      const stores = findNearbyStores(newLocation.latitude, newLocation.longitude, maxDistance)
      setNearbyStores(stores as NearbyStore[])
      setLoading(false)
    }

    const error = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("Please enable location services to find nearby sales")
          break
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable")
          break
        case error.TIMEOUT:
          setError("Location request timed out")
          break
        default:
          setError("An unknown error occurred")
          break
      }
      setLoading(false)
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(success, error)

    // Watch for location changes
    watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })

    // Cleanup
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [maxDistance])

  return { location, nearbyStores, error, loading }
}

