import React, { useContext } from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import useFabStyles from './styles'
import { DarkModeContext } from '../Theme/DarkModeContext'
import Tooltip from '@material-ui/core/Tooltip'
import { sendMessage } from '../../util/message'
import messageTypes from '../../util/message-types'

const FloatingActionButton = () => {
  const classes = useFabStyles()
  const { darkMode } = useContext(DarkModeContext)
  const isDarkMode = darkMode !== undefined ? Boolean(darkMode) : false

  return (
    <Tooltip title="Upload new deck" aria-label="upload new deck">
      <Fab
        color={isDarkMode ? 'secondary' : 'primary'}
        className={classes.root}
        onClick={() => {
          sendMessage(messageTypes.MSG_UPLOAD_DECK)
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  )
}

export default FloatingActionButton
