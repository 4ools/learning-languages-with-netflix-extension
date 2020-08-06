import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import useFlashCardStyles from './sytles'
import Rate from '../Rate'
import { Typography, Box } from '@material-ui/core'

const highlightedContext = (item) => {
  return item.subtitleContext.subs.map((contextLine) => {
    const splitRegex = new RegExp(`(${item.word})`)
    return contextLine
      .split(splitRegex)
      .map((part, index) => (
        <React.Fragment key={`sub-title-${item.word}-${index}`}>
          {part === item.word ? <strong>{part}</strong> : part}{' '}
        </React.Fragment>
      ))
  })
}

const FlashCard = ({ item }) => {
  const [shown, setShown] = useState(false)
  const flashCardClassed = useFlashCardStyles({ shown })

  const { word, wordDefinition } = item

  return (
    <Card className={flashCardClassed.root} onClick={() => setShown(true)}>
      <CardContent className={flashCardClassed.content}>
        {!shown ? (
          <Box className={flashCardClassed.emptyCard}>
            <Typography variant="h6">{word}</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
              {word}
              {' = '}
              {wordDefinition}
            </Typography>
            <Typography variant="body2">{highlightedContext(item)}</Typography>
          </>
        )}
      </CardContent>
      {shown && (
        <CardActions className={flashCardClassed.actionArea}>
          <Box className={flashCardClassed.actionBox}>
            <Box mb={1}>
              <Typography variant="body2" className={flashCardClassed.rateText}>
                How easy was that?
              </Typography>
            </Box>
            <Rate />
          </Box>
        </CardActions>
      )}
    </Card>
  )
}

export default FlashCard
