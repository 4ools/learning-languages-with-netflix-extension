import React from 'react'
import FlashCard from '../FlashCard'
import * as savedItems from '../../data/sample.json'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'

const FlashCardPage = () => (
  <>
    <Typography variant="h3" component="h2">
      Welcome to the flash cards.
    </Typography>
    <Typography variant="body1">
      Click on a card when you think you know the answer!
    </Typography>
    <Grid container spacing={3}>
      {savedItems.default
        .filter((item) => item.word && item.wordDefinition)
        .map((item, index) => (
          <Grid item sm={12} md={3} key={`flash-card-grid-item-${index}`}>
            <FlashCard word={item.word} answer={item.wordDefinition} />
          </Grid>
        ))}
    </Grid>
  </>
)

export default FlashCardPage
