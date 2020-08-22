import React, { useState, useEffect } from 'react'
import { onMessage } from '../../util/message'
import messageTypes from '../../util/message-types'

const CurrentDeckContext = React.createContext(null)

const CurrentDeckProvider = ({ children }) => {
  const [deck, setCurrentDeck] = useState(null)

  // when we get some practice cards update what cards we are looking at
  useEffect(() => {
    onMessage(messageTypes.MSG_PRACTICE_CARDS, (_, cards) => {
      setCurrentDeck({ ...cards, parctice: true })
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
