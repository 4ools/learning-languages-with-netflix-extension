import React from 'react'
import Rating from '@material-ui/lab/Rating'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import { withStyles } from '@material-ui/core/styles'

const StyledRating = withStyles(({ palette, spacing }) => ({
  iconFilled: {
    color: palette.success.main,
  },
  iconHover: {
    color: palette.success.main,
  },
  iconEmpty: {
    color: palette.success.light,
  },
}))(Rating)

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Super Easy',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Easy',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Had to think',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Hard',
  },
}

const IconContainer = (props) => {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

const Rate = ({ action, item }) => (
  <StyledRating
    name={`customized-icons-${item.timeCreated}`}
    size="large"
    defaultValue={3}
    getLabelText={(value) => customIcons[value].label}
    IconContainerComponent={IconContainer}
    onChange={() => action()}
  />
)

export default Rate
