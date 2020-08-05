import React, { useState } from 'react'

const CurrentDeckContext = React.createContext(null)

const CurrentDeckProvider = ({ children }) => {
  const [deck, setCurrentDeck] = useState(null)

  return (
    <CurrentDeckContext.Provider
      value={{
        deck,
        setCurrentDeck,
      }}
    >
      {children}
    </CurrentDeckContext.Provider>
  )
}

export { CurrentDeckContext, CurrentDeckProvider }
