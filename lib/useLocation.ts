"use client"

import { useState, useEffect } from "react"
import { findNearbyStores, type Store } from "./stores"

async function getCityFromCoordinates(lat: number, lon: number): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
  if (!apiKey) {
    console.error("OpenWeatherMap API key is not set")
    return null
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
    )
    const data = await response.json()
    console.log("OpenWeatherMap API Response:", JSON.stringify(data, null, 2))
    if (data && data.length > 0) {
      const { name, state, country } = data[0]
      return `${name}, ${state || ""}, ${country}`.replace(/, ,/g, ",").replace(/^,\s*/, "").replace(/,\s*$/, "")
    } else {
      console.error("No location data found in the API response")
    }
  } catch (error) {
    console.error("Error fetching city data:", error)
  }
  return null
}

export interface Location {
  latitude: number
  longitude: number
}

export interface NearbyStore extends Store {
  distance: number
}

export interface UseLocationResult {
  location: Location | null
  city: string | null
  error: string | null
  nearbyStores: NearbyStore[]
}

export function useLocation(maxDistance = 0.5) {
  const [location, setLocation] = useState<Location | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nearbyStores, setNearbyStores] = useState<NearbyStore[]>([])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    const success = async (position: GeolocationPosition) => {
      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      console.log("Geolocation:", newLocation)
      setLocation(newLocation)
      updateNearbyStores(newLocation)

      const cityName = await getCityFromCoordinates(newLocation.latitude, newLocation.longitude)
      console.log("Location:", cityName)
      setCity(cityName)
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

  return { location, city, error, nearbyStores }
}

