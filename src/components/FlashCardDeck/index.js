import React from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'

const FlashCardDeck = ({ cards }) => {
  return (
    <>
      <h1>A deck</h1>
      {cards
        .filter((item) => item.word && item.wordDefinition)
        .map((item) => (
          <Grid item sm={12} md={3} key={`flash-card-${item.timeCreated}`}>
            <FlashCard item={item} />
          </Grid>
        ))}
    </>
  )
}

export default FlashCardDeck
