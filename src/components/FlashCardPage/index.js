import React from 'react'
import FlashCardDeck from '../FlashCardDeck'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import useCardDecks from './useCardDecks'

const FlashCardPage = () => {
  // we will get the decks of cards here.
  // the decks will change if new ones are uploaded
  // they are just the items in the file system
  const decks = useCardDecks()

  return (
    <>
      <Typography variant="body1" style={{ marginBottom: 30 }}>
        Click a card if you think you know the answer
      </Typography>
      <Grid container spacing={3}>
        {decks.map((cards, index) => (
          <FlashCardDeck cards={cards} key={`flash-card-deck-${index}`} />
        ))}
      </Grid>
    </>
  )
}

export default FlashCardPage
