import React, { useState, useEffect, useContext, useRef } from 'react'
import { onMessage } from '../../util/message'
import messageTypes from '../../util/message-types'
import { CurrentDeckContext } from '../CurrentDeck'

const AllDecksContext = React.createContext(null)

const getNewDeck = (fileDetails) => {
  const { content, file } = fileDetails

  // if we do not have the right file struct, just come out
  if (!content) {
    return
  }
  // push the new deck to the array
  // get a name using the timestamp from the first item in the session
  const date = new Date(content[0].timeCreated) || Date.now()
  const name = content[0].customName || date.toDateString()

  const rating = getRating(content)

  console.log('setting the cards rating as', rating)

  return {
    name,
    cards: content,
    rating,
    file,
  }
}

// for a deck set a rating prop, based on the average of the ratings
// for each of the cards
const getRating = (cards) => {
  // sum / amount is mean
  const ratings = cards
    .filter((card) => card.rating !== undefined)
    .map((card) => card.rating)
  if (!ratings.length) {
    return undefined
  }

  const rating = ratings.reduce((total, amount, index, array) => {
    total += amount
    if (index === array.length - 1) {
      return total / array.length
    } else {
      return total
    }
  })
  return rating
}

const AllDecksProvider = ({ children }) => {
  const [allDecks, setAllDecks] = useState([])
  const decks = useRef([])
  const { setCurrentDeck } = useContext(CurrentDeckContext)

  useEffect(() => {
    async function addDeckFor(fileDetails) {
      const newDeck = getNewDeck(fileDetails)

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

    // replace just the file that was updated in the context
    function updateUsingFile(_, file) {
      const updatedDeck = getNewDeck(file)
      const newDecks = decks.current.map((deck) =>
        deck.name === updatedDeck.name ? updatedDeck : deck
      )
      decks.current = newDecks
      setAllDecks([...decks.current])
    }

    onMessage(messageTypes.MSG_FLASH_CARD_FILES, updateDecksUsingFiles)
    onMessage(messageTypes.MSG_FLASH_CARD_FILE, updateUsingFile)
  }, [setCurrentDeck])

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
