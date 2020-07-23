import React, { useEffect } from 'react'
import FlashCard from '../FlashCard'
import * as savedItems from '../../data/sample.json'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import getFlashCardFiles from './flashCardsFiles'

const FlashCardPage = () => {
  useEffect(() => {
    if (window.ipcRenderer) {
      console.log('we have the ipc renderer')
    }
    // we do not have this in the browser version
    window.ipcRenderer &&
      window.ipcRenderer.on(
        'flashCardFiles',
        (cards) => {
          console.log('we have the cards!')
          console.log(cards)
        }
        // getFlashCardFiles(cards)
      )
  }, [])

  return (
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
}

export default FlashCardPage
