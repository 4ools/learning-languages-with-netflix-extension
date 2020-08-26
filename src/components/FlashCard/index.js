import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import useFlashCardStyles from './sytles'
import Rate from '../Rate'
import { Typography, Box, CardHeader } from '@material-ui/core'
import { useSpring, animated as a } from 'react-spring'
import IconButton from '@material-ui/core/IconButton'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'

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

const synth = window.speechSynthesis
let voices

// we need to wait till the voices are ready in my head
window.speechSynthesis.onvoiceschanged = () => {
  voices = synth.getVoices()
}

const getVoice = (lang) => {
  return voices.filter((v) => v.lang.split('-')[0] === lang)[0]
}

const FlashCard = ({ item, onRate }) => {
  const [shown, setShown] = useState(false)
  const flashCardClasses = useFlashCardStyles({ shown })

  const { word, wordDefinition, language } = item

  const { transform, opacity } = useSpring({
    opacity: shown ? 1 : 0,
    transform: `perspective(600px) rotateX(${shown ? 180 : 0}deg)`,
    config: { mass: 7, tension: 1000, friction: 100 },
  })

  const playText = () => {
    const voice = getVoice(language)
    if (!voice) {
      return
    }
    var utterance = new SpeechSynthesisUtterance(word)
    utterance.text = word
    utterance.voice = voice
    synth.speak(utterance)
  }

  return (
    <div
      onClick={() => setShown(true)}
      className={flashCardClasses.flipContainer}
    >
      <a.div
        className={flashCardClasses.back}
        style={{
          opacity,
          transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
        }}
      >
        <Card className={flashCardClasses.root}>
          <CardHeader
            action={
              <IconButton onClick={() => playText()} aria-label="play">
                <RecordVoiceOverIcon className={flashCardClasses.whiteText} />
              </IconButton>
            }
            className={flashCardClasses.whiteText}
            title={word}
            subheader={
              <span className={flashCardClasses.whiteText}>
                {wordDefinition}
              </span>
            }
          />
          <CardContent className={flashCardClasses.content}>
            <Typography variant="body2">{highlightedContext(item)}</Typography>
          </CardContent>

          <CardActions className={flashCardClasses.actionArea}>
            <Box className={flashCardClasses.actionBox}>
              <Box mb={1}>
                <Typography
                  variant="body2"
                  className={flashCardClasses.rateText}
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
        className={flashCardClasses.front}
        style={{ opacity: opacity.interpolate((o) => 1 - o), transform }}
      >
        <Card className={flashCardClasses.root}>
          <Box className={flashCardClasses.emptyCard}>
            <Typography variant="h5">{word}</Typography>
          </Box>
        </Card>
      </a.div>
    </div>
  )
}

export default FlashCard
