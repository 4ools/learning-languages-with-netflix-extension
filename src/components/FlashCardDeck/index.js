import React, { useState, useEffect } from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'

const FlashCardDeck = ({ cards }) => {
  // so we can remove cards once studied
  const [currentCards, setCurrentCards] = useState(cards)

  useEffect(() => {
    setCurrentCards(cards)
  }, [cards])

  return currentCards
    .filter((item) => item.word && item.wordDefinition)
    .map((item) => (
      <Grid item sm={12} md={4} key={`flash-card-${item.timeCreated}`}>
        <FlashCard
          item={item}
          onRate={() => {
            setCurrentCards([...currentCards.filter((card) => card !== item)])
          }}
        />
      </Grid>
    ))
}

export default FlashCardDeck
