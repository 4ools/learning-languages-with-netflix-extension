import React, { useState, useEffect } from 'react'
import FlashCard from '../FlashCard'
import Grid from '@material-ui/core/Grid'
import { useTransition, animated } from 'react-spring'

const FlashCardDeck = ({ cards }) => {
  // so we can remove cards once studied
  const [currentCards, setCurrentCards] = useState(cards)

  useEffect(() => {
    setCurrentCards(cards.filter((item) => item.word && item.wordDefinition))
  }, [cards])

  // now convert them into animated items
  const transitions = useTransition(currentCards, (item) => item.timeCreated, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return transitions.map(({ item, props, key }) => (
    <Grid item sm={12} md={4} key={`flash-card-${key}`}>
      <animated.div style={props}>
        <FlashCard
          item={item}
          onRate={() => {
            setCurrentCards([...currentCards.filter((card) => card !== item)])
          }}
        />
      </animated.div>
    </Grid>
  ))

  // return currentCards
  //   .filter((item) => item.word && item.wordDefinition)
  //   .map((item) => (

  //   ))
}

export default FlashCardDeck
