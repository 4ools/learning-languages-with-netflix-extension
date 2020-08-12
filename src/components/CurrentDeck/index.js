import React, { useState, useEffect } from 'react'
import { onMessage, MSG_PRACTICE_CARDS } from '../../util/message'

const CurrentDeckContext = React.createContext(null)

const CurrentDeckProvider = ({ children }) => {
  const [deck, setCurrentDeck] = useState(null)

  // when we get some practice cards update what cards we are looking at
  useEffect(() => {
    onMessage(MSG_PRACTICE_CARDS, (_, cards) => {
      console.log('got some practice cards')
      setCurrentDeck(cards)
    })
  }, [])

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
