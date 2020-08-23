import React, { useContext } from 'react'
import FlashCardDeck from '../FlashCardDeck'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { CurrentDeckContext } from '../CurrentDeck'
import { ReactComponent as Tree } from '../../svgs/tree.svg'
import { ReactComponent as Winner } from '../../svgs/winner.svg'
import EmptyState from '../EmptyState'
import { sendMessage } from '../../util/message'
import messageTypes from '../../util/message-types'
import { AllDecksContext } from '../AllDecks'

const FlashCardPage = () => {
  const { deck, setCurrentDeck } = useContext(CurrentDeckContext)
  const { allDecks, setAllDecks } = useContext(AllDecksContext)

  // there is no need to render anything unless a deck has been
  // chosen
  if (!deck || !deck.cards) {
    return (
      <EmptyState
        title="Click on a session to re-do a session or practice"
        max="350"
      >
        <Tree width="100%" fillOpacity="0.8" height="auto" />
      </EmptyState>
    )
  }

  // if you did the deck
  if (deck.cards.length === 0) {
    return (
      <EmptyState title="Woop woop 🎉" max="500px">
        <Winner width="100%" height="auto" />
      </EmptyState>
    )
  }

  return (
    <>
      <Typography
        contentEditable={!deck.parctice}
        variant="h5"
        onBlur={(e) => {
          // send the new name of the deck to the electron FS
          const newName = e.currentTarget.textContent

          sendMessage(messageTypes.MSG_SET_DECK_NAME, {
            newName,
            fileName: deck.file,
          })

          // update the file name in context so we do not have to reload all the cards again
          deck.customName = newName
          setCurrentDeck({ ...deck })

          // update the "all decks" context which is used in places like the navigation
          setAllDecks(
            allDecks.map((deckItem) => {
              if (deck.file === deckItem.file) {
                deckItem.name = newName
              }
              return deckItem
            })
          )
        }}
        style={{ marginBottom: 30, marginTop: 30 }}
      >
        {deck.parctice ? 'Practice Mode' : deck.name}
      </Typography>
      <Grid container spacing={3}>
        <FlashCardDeck />
      </Grid>
    </>
  )
}

export default FlashCardPage
