import { useEffect, useState } from 'react'

const useCardDecks = () => {
  const [decks, setDecks] = useState([])

  useEffect(() => {
    async function addDeckFor(file) {
      // use a dynamic import to get the contents of the deck of cards
      const data = await import(`../../data/${file}`)
      // if we do not have the right file struct, just come out
      if (!data.default) {
        console.log('no data default, will not load it')
        return
      }
      console.log('should add', data.default)
      // add the deck to the cards
      debugger
      const oldDecks = decks
      console.log('the old decks are', oldDecks)
      setDecks([...decks, data.default])
    }

    function updateDecksUsingFiles(_, files) {
      // import all the files and join the contents to
      // a new array of cards to display
      files.forEach((file) => addDeckFor(file))
    }

    // we do not have this in the browser version
    window.ipcRenderer &&
      window.ipcRenderer.on('flashCardFiles', updateDecksUsingFiles)
  }, [decks])

  return decks
}

export default useCardDecks
