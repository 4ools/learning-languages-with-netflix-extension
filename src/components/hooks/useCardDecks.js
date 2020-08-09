import { useEffect, useState, useRef } from 'react'
import { onMessage, MSG_FLASH_CARD_FILES } from '../../util/message'

const useCardDecks = () => {
  const [renderDecks, setDecks] = useState([])
  const decks = useRef([])

  useEffect(() => {
    function updateDecksUsingFiles(files) {
      if (!files) {
        return
      }
      // always reset the decks
      setDecks([])
      // import all the files and join the contents to
      // a new array of cards to display
      files.forEach((file) => addDeckFor(file))
    }

    async function addDeckFor(file) {
      // const path = `../../data/${file}`
      const path = `../../data/${file}`
      console.log(path)
      // use a dynamic import to get the contents of the deck of cards
      const data = await import(path)
      // if we do not have the right file struct, just come out
      if (!data.default) {
        return
      }
      // push the new deck to the array
      // get a name using the timestamp from the first item in the session
      const date = new Date(data.default[0].timeCreated) || Date.now()

      decks.current.push({
        name: date.toDateString(),
        cards: data.default,
        file,
      })
      // trigger a re-render
      // make sure to spread the state else it is considered
      // the same obj and will not re-render the new state
      // in the DOM
      setDecks([...decks.current])
    }

    onMessage(MSG_FLASH_CARD_FILES, (_, files) => {
      updateDecksUsingFiles(files)
    })

    // remove this after testing
    updateDecksUsingFiles(['sample.json', 'another-one.json'])
  }, [])

  return renderDecks
}

export default useCardDecks
