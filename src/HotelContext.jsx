import * as React from 'react'

export const HotelContext = React.createContext({ hotel: null, setHotel: () => {} })

export function HotelProvider({ children }) {
  const [hotel, setHotel] = React.useState(null)
  const value = React.useMemo(() => ({ hotel, setHotel }), [hotel])
  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
}

export function useHotel() {
  return React.useContext(HotelContext)
}
