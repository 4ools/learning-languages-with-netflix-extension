const messageType = require('../message-types')
const { ipcMain } = require('electron')
const practiceDataStore = require('../practice-store')
const saveRating = require('../save-rating')

const Store = require('electron-store')
const store = new Store()

function sortCardsByWeight(a, b) {
  if (a.weight < b.weight) {
    return -1
  }
  if (a.weight > b.weight) {
    return 1
  }
  return 0
}

const init = (mainWindow) => {
  // when a card is updated with a rating
  ipcMain.on(messageType.MSG_RATE_CARD, (_, { item, deckName, rating }) => {
    let practiceData = store.get(practiceDataStore)
    // must be the first card ever rated so lets set up the store
    if (!practiceData) {
      // init it and get it again
      store.set(practiceDataStore, {})
      practiceData = store.get(practiceDataStore)
    }

    // if there was no deck name, we have a rating on the practice screen
    // so we need to find the card by its time updated and update the rating
    // and time practiced
    if (!deckName) {
      Object.keys(practiceData).forEach((deckName) => {
        Object.keys(practiceData[deckName]).forEach((cardName) => {
          if (Number(cardName) === Number(item.timeCreated)) {
            practiceData[deckName][cardName].lastPractice = Date.now()
            practiceData[deckName][cardName].rating = rating

            // save the rating on file
            saveRating(mainWindow, item, deckName, rating)
          }
        })
      })
    } else {
      // as we have the file we will add the rating on the card in the
      // actual file here. this makes sure it is persisted
      saveRating(mainWindow, item, deckName, rating)

      // if we do not already have the deck
      if (!practiceData[deckName]) {
        practiceData[deckName] = {}
      }

      // if the card is not in the deck, add it there
      if (!practiceData[deckName][item.timeCreated]) {
        practiceData[deckName][item.timeCreated] = item
      }

      // now we update the time last practiced and the rating
      // these are then used by practice mode to work out
      // what decks to practice
      practiceData[deckName][item.timeCreated].lastPractice = Date.now()
      practiceData[deckName][item.timeCreated].rating = rating
    }

    // set the store again
    store.set(practiceDataStore, practiceData)
  })

  ipcMain.on(messageType.MSG_GET_PRACTICE_CARDS, () => {
    // we will get some cards and send em back
    let cards = []
    const practiceData = store.get(practiceDataStore)

    if (!practiceData) {
      // just let them know right away, we have nothing to
      // practice here
      mainWindow.webContents.send(messageType.MSG_PRACTICE_CARDS, cards)
      return
    }

    // we will give each card a weight based on the difficulty * time
    const weights = []
    Object.keys(practiceData).forEach((deckName) => {
      Object.keys(practiceData[deckName]).forEach((cardName) => {
        const card = practiceData[deckName][cardName]
        weights.push({
          // @TODO here we should check if 4 days, 10 days and so on passed
          // then we should up the weight based on how long has passed.
          // a card with a weight of like 4 days should have a super high prio
          // as this is the time that they could forget about the word on the card
          // and if it is say > 4 < 10 it gets x1 but >5 < 10 x1.1 and so on
          weight: card.rating * card.lastPractice,
          card,
        })
      })
    })

    // now we have the cards by weight we just sort and grab the top x
    // and return them
    weights.sort(sortCardsByWeight).reverse()

    const cuttingPoint = weights.length > 20 ? 20 : weights.length
    cards = weights.slice(0, cuttingPoint).map((weightCard) => weightCard.card)
    const formattedCards = { cards }

    mainWindow.webContents.send(messageType.MSG_PRACTICE_CARDS, formattedCards)
  })
}

module.exports = init
