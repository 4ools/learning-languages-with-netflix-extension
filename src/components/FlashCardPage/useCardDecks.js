import { useEffect, useState } from 'react'

const useCardDecks = () => {
  const [decks, setDecks] = useState([])

  useEffect(() => {
    // we do not have this in the browser version
    window.ipcRenderer &&
      window.ipcRenderer.on('flashCardFiles', (event, files) => {
        // import all the files and join the contents to
        // a new array of cards to display
        files.forEach(async (file) => {
          // use a dynamic import to get the contents of the deck of cards
          const data = await import(`../../data/${file}`)
          // if we do not have the right file struct, just come out
          if (!data.default) {
            return
          }
          // add the deck to the cards
          setDecks([...decks, data.default])
        })
      })
  }, [decks])

  return decks
}

export default useCardDecks
