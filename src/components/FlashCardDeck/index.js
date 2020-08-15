import React, { useContext } from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'
import { sendMessage, MSG_RATE_CARD } from '../../util/message'
import { CurrentDeckContext } from '../CurrentDeck'

const FlashCardDeck = () => {
  const { deck, setCurrentDeck } = useContext(CurrentDeckContext)

  return deck.cards
    .filter((item) => item.word && item.wordDefinition)
    .map((item) => (
      <Grid item xs={12} md={6} lg={4} key={`flash-card-${item.timeCreated}`}>
        <FlashCard
          item={item}
          onRate={(rating) => {
            sendMessage(MSG_RATE_CARD, {
              item,
              rating,
              deckName: deck.file,
            })

            // remove the card from the list
            setCurrentDeck({
              ...deck,
              cards: [...deck.cards.filter((card) => card !== item)],
            })
          }}
        />
      </Grid>
    ))
}

export default FlashCardDeck
