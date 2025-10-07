import * as React from 'react'

const HOTEL_CACHE_KEY = 'wc.hotelData'

function readCachedHotel() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(HOTEL_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse cached hotel data', err)
    return null
  }
}

export const HotelContext = React.createContext({ hotel: null, setHotel: () => {} })

export function HotelProvider({ children }) {
  const [hotel, setHotel] = React.useState(() => readCachedHotel())

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (hotel) {
        window.localStorage.setItem(HOTEL_CACHE_KEY, JSON.stringify(hotel))
      } else {
        window.localStorage.removeItem(HOTEL_CACHE_KEY)
      }
    } catch (err) {
      console.warn('Failed to persist hotel cache', err)
    }
  }, [hotel])

  const value = React.useMemo(() => ({ hotel, setHotel }), [hotel])
  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
}

export function useHotel() {
  return React.useContext(HotelContext)
}
