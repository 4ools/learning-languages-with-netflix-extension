import React, { useContext } from 'react'
import FlashCardDeck from '../FlashCardDeck'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { CurrentDeckContext } from '../CurrentDeck'
import { ReactComponent as Tree } from '../../svgs/tree.svg'
import EmptyState from '../EmptyState'

const FlashCardPage = () => {
  const { deck } = useContext(CurrentDeckContext)

  // there is no need to render anything unless a deck has been
  // chosen
  if (!deck) {
    return (
      <EmptyState>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Click on a session to re-do a session or practice
        </Typography>
        <Tree width="100%" />
      </EmptyState>
    )
  }

  const date = new Date(deck.cards[0].timeCreated) || Date.now()
  return (
    <>
      <Typography variant="h5" style={{ marginBottom: 30, marginTop: 30 }}>
        Card Deck: {date.toDateString()}
      </Typography>
      <Grid container spacing={3}>
        <FlashCardDeck cards={deck.cards} deckName={deck.file} />
      </Grid>
    </>
  )
}

export default FlashCardPage
