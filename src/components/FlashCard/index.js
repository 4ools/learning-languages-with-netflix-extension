import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import useFlashCardStyles from './sytles'
import Rate from '../Rate'
import { Typography, Box } from '@material-ui/core'
import { useSpring, animated as a } from 'react-spring'

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

const FlashCard = ({ item, onRate }) => {
  const [shown, setShown] = useState(false)
  const flashCardClassed = useFlashCardStyles({ shown })

  const { word, wordDefinition } = item

  const { transform, opacity } = useSpring({
    opacity: shown ? 1 : 0,
    transform: `perspective(600px) rotateX(${shown ? 180 : 0}deg)`,
    config: { mass: 7, tension: 1000, friction: 100 },
  })

  return (
    <div
      onClick={() => setShown(true)}
      className={flashCardClassed.flipContainer}
    >
      <a.div
        className={flashCardClassed.back}
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
        }}
      >
        <Card className={flashCardClassed.root}>
          <CardContent className={flashCardClassed.content}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
              {word}
              {' = '}
              {wordDefinition}
            </Typography>
            <Typography variant="body2">{highlightedContext(item)}</Typography>
          </CardContent>

          <CardActions className={flashCardClassed.actionArea}>
            <Box className={flashCardClassed.actionBox}>
              <Box mb={1}>
                <Typography
                  variant="body2"
                  className={flashCardClassed.rateText}
                >
                  How easy was that?
                </Typography>
              </Box>
              <Rate
                action={onRate}
                name={`customized-icons-${item.timeCreated}`}
              />
            </Box>
          </CardActions>
        </Card>
      </a.div>
      <a.div
        className={flashCardClassed.front}
        style={{ opacity: opacity.interpolate((o) => 1 - o), transform }}
      >
        <Card className={flashCardClassed.root}>
          <Box className={flashCardClassed.emptyCard}>
            <Typography variant="h5">{word}</Typography>
          </Box>
        </Card>
      </a.div>
    </div>
  )
}

export default FlashCard
