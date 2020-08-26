import React from 'react'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'

const DeckIcon = ({ color, rating }) => {
  if (rating === undefined) {
    return <NewReleasesIcon color={color} />
  }
  switch (Math.ceil(rating)) {
    case 5:
      return <SentimentVeryDissatisfiedIcon color={color} />
    case 4:
      return <SentimentDissatisfiedIcon color={color} />
    case 3:
      return <SentimentSatisfiedIcon color={color} />
    case 2:
      return <SentimentSatisfiedAltIcon color={color} />
    case 1:
      return <SentimentVerySatisfiedIcon color={color} />
    default:
      return <NewReleasesIcon color={color} />
  }
}

export default DeckIcon
