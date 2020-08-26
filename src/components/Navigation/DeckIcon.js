import React from 'react'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'

const difficultyIcons = {
  5: {
    icon: <SentimentVeryDissatisfiedIcon />,
  },
  4: {
    icon: <SentimentDissatisfiedIcon />,
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
  },
  2: {
    icon: <SentimentSatisfiedAltIcon />,
  },
  1: {
    icon: <SentimentVerySatisfiedIcon />,
  },
}

const DeckIcon = ({ color, rating }) => {
  // if we did not rate any cards in the deck.
  // we do not have a difficulty so just return the default icon
  if (!rating) {
    return <NewReleasesIcon color={color} />
  }

  return (
    difficultyIcons[Math.ceil(rating)]?.icon || (
      <NewReleasesIcon color={color} />
    )
  )
}

export default DeckIcon
