import React, { useState, useEffect } from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'

const FlashCardDeck = ({ cards }) => {
  const [currentCards, setCurrentCards] = useState(cards)

  useEffect(() => {
    setCurrentCards(cards)
  }, [cards])

  return currentCards
    .filter((item) => item.word && item.wordDefinition)
    .map((item) => (
      <Grid item xs={12} md={6} lg={4} key={`flash-card-${item.timeCreated}`}>
        <FlashCard
          item={item}
          onRate={(rating) => {
            // @TODO
            // tell main to store this word and how hard it was

            // remove the card from the list
            setCurrentCards([...currentCards.filter((card) => card !== item)])
          }}
        />
      </Grid>
    ))
}

export default FlashCardDeck
