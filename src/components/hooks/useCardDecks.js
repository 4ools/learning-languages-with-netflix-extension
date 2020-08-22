import { useEffect, useState, useRef, useContext } from 'react'
import { onMessage } from '../../util/message'
import messageTypes from '../../util/message-types'
import { CurrentDeckContext } from '../CurrentDeck'

const useCardDecks = () => {
  const [renderDecks, setDecks] = useState([])
  const { setCurrentDeck } = useContext(CurrentDeckContext)
  const decks = useRef([])

  useEffect(() => {
    function updateDecksUsingFiles(_, files) {
      // always reset the decks
      decks.current = []
      setDecks([])

      if (!files) {
        return
      }
      // import all the files and join the contents to
      // a new array of cards to display
      files.forEach((file) => addDeckFor(file))
    }

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
      // trigger a re-render
      // make sure to spread the state else it is considered
      // the same obj and will not re-render the new state
      // in the DOM
      setDecks([...decks.current])

      // set the view to show the active deck via the deck context
      setCurrentDeck(newDeck)
    }

    onMessage(messageTypes.MSG_FLASH_CARD_FILES, updateDecksUsingFiles)
  }, [setCurrentDeck])

  return renderDecks
}

export default useCardDecks
