import React from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'

const FlashCardDeck = ({ cards }) => {
  return cards
    .filter((item) => item.word && item.wordDefinition)
    .map((item, index) => (
      <Grid item sm={12} md={3} key={`flash-card-grid-item-${index}`}>
        <FlashCard item={item} />
      </Grid>
    ))
}

export default FlashCardDeck
