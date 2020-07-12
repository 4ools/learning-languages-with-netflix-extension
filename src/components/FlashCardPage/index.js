import React from 'react'
import FlashCard from '../FlashCard'
import * as savedItems from '../../data/sample.json'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'

// @TODO pass the cards to page as some sort of page props
const FlashCardPage = ({ cards }) => (
  <>
    <Typography variant="body1" style={{ marginBottom: 30 }}>
      Click on a card when you think you know the answer!
    </Typography>
    <Grid container spacing={3}>
      {savedItems.default
        .filter((item) => item.word && item.wordDefinition)
        .map((item, index) => (
          <Grid item sm={12} md={3} key={`flash-card-grid-item-${index}`}>
            <FlashCard item={item} />
          </Grid>
        ))}
    </Grid>
  </>
)

export default FlashCardPage
