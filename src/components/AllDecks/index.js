import React, { useState, useEffect, useContext, useRef } from 'react'
import { onMessage } from '../../util/message'
import messageTypes from '../../util/message-types'
import { CurrentDeckContext } from '../CurrentDeck'

const AllDecksContext = React.createContext(null)

const AllDecksProvider = ({ children }) => {
  const [allDecks, setAllDecks] = useState([])
  const decks = useRef([])
  const { setCurrentDeck } = useContext(CurrentDeckContext)

  useEffect(() => {
    async function addDeckFor(fileDetails) {
      const { content, file } = fileDetails

      // if we do not have the right file struct, just come out
      if (!content) {
        return
      }
      // push the new deck to the array
      // get a name using the timestamp from the first item in the session
      const date = new Date(content[0].timeCreated) || Date.now()
      const name = content[0].customName || date.toDateString()

      const newDeck = {
        name,
        cards: content,
        file,
      }

      decks.current.push(newDeck)

      setAllDecks([...decks.current])

      // set the view to show the active deck via the deck context
      setCurrentDeck(newDeck)
    }

    function updateDecksUsingFiles(_, files) {
      decks.current = []
      setAllDecks([])

      if (!files) {
        return
      }
      // import all the files and join the contents to
      // a new array of cards to display
      files.forEach((file) => addDeckFor(file))
    }

    onMessage(messageTypes.MSG_FLASH_CARD_FILES, updateDecksUsingFiles)
  }, [allDecks, setCurrentDeck])

  return (
    <AllDecksContext.Provider
      value={{
        allDecks,
        setAllDecks,
      }}
    >
      {children}
    </AllDecksContext.Provider>
  )
}

export { AllDecksContext, AllDecksProvider }
