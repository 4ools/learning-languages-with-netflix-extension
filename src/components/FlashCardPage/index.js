import React, { useContext } from 'react'
import FlashCardDeck from '../FlashCardDeck'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { CurrentDeckContext } from '../CurrentDeck'
import { ReactComponent as Tree } from '../../svgs/tree.svg'
import { ReactComponent as Winner } from '../../svgs/winner.svg'
import EmptyState from '../EmptyState'

const FlashCardPage = () => {
  const { deck } = useContext(CurrentDeckContext)

  // there is no need to render anything unless a deck has been
  // chosen
  if (!deck) {
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

  const date = new Date(deck.cards[0].timeCreated) || Date.now()
  return (
    <>
      <Typography variant="h5" style={{ marginBottom: 30, marginTop: 30 }}>
        Card Deck: {date.toDateString()}
      </Typography>
      <Grid container spacing={3}>
        <FlashCardDeck />
      </Grid>
    </>
  )
}

export default FlashCardPage
