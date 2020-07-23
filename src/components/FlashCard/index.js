import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import useFlashCardStyles from './sytles'
import { Typography } from '@material-ui/core'

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
      {!shown ? (
        <Typography variant="h6">{word}</Typography>
      ) : (
        <>
          <Typography variant="h6" style={{ marginBottom: '20px' }}>
            {wordDefinition}
          </Typography>
          <Typography variant="body2">{highlightedContext(item)}</Typography>
        </>
      )}
    </Card>
  )
}

export default FlashCard
