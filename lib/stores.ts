export interface Store {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
}

// This would typically come from a database or API
// For demo purposes, using some sample store locations
export const stores: Store[] = [
  {
    id: "walmart-boardwalk",
    name: "Walmart the Boardwalk",
    latitude: 43.4330164,
    longitude: -80.5607798,
    address: "100 The Boardwalk, Kitchener, ON N2N 0B1",
  },
  {
    id: "market-cmh",
    name: "The Market at CMH",
    latitude: 43.4702203,
    longitude: -80.5383823,
    address: "Claudette Millar Hall, University of Waterloo Place, Waterloo, ON",
  },
  {
    id: "lazaridis-hall",
    name: "Lazaridis Hall",
    latitude: 43.4750999,
    longitude: -80.5320229,
    address: "64 University Ave W, Waterloo, ON N2L 3C7",
  },
]

// Haversine formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function findNearbyStores(
  latitude: number,
  longitude: number,
  maxDistance = 2, // Default 2km radius
): Store[] {
  return stores
    .map((store) => ({
      ...store,
      distance: getDistanceFromLatLonInKm(latitude, longitude, store.latitude, store.longitude),
    }))
    .filter((store) => store.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

