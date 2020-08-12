import React, { useContext, useState } from 'react'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import DeleteIcon from '@material-ui/icons/Delete'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import useCardDecks from '../hooks/useCardDecks'
import useNavigationStyles from './styles'
import { CurrentDeckContext } from '../CurrentDeck'
import { DarkModeContext } from '../Theme/DarkModeContext'
import {
  sendMessage,
  MSG_REMOVE_FILE,
  MSG_GET_PRACTICE_CARDS,
} from '../../util/message'

const Navigation = () => {
  // this hook gives us all the files in the FS that have decks
  const decks = useCardDecks()
  const classes = useNavigationStyles()
  const currentDeckContext = useContext(CurrentDeckContext)
  const { darkMode, setDarkMode } = useContext(DarkModeContext)
  const [selectedItem, setSelectedItem] = useState(null)

  const currentMode = darkMode !== undefined ? Boolean(darkMode) : false

  return (
    <>
      <AppBar
        // @TODO come back to this shit
        color={currentMode ? 'inherit' : 'primary'}
        position="fixed"
        style={{ zIndex: 3000 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            LLN companion app
          </Typography>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={currentMode}
                onChange={(event) => {
                  setDarkMode(event.target.checked)
                }}
                name="DarkMode"
              />
            }
            label="Dark Mode"
          />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List disablePadding={true}>
            <ListItem
              button
              selected={selectedItem === '-1'}
              onClick={() => {
                setSelectedItem('-1')
                sendMessage(MSG_GET_PRACTICE_CARDS)
              }}
            >
              <ListItemIcon>
                <FitnessCenterIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Practice" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="h6">Sessions</Typography>
            </ListItem>
          </List>
          <Divider />
          <List disablePadding={true}>
            {decks.map((deck, index) => (
              <ListItem
                selected={selectedItem === index}
                button
                key={`card-deck-in-nav-${index}`}
                onClick={() => {
                  setSelectedItem(index)
                  currentDeckContext.setCurrentDeck(deck)
                }}
              >
                <ListItemIcon>
                  <CalendarTodayIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={deck.name} />

                <DeleteIcon
                  color="error"
                  onClick={(event) => {
                    // stop the click loading cards
                    event.stopPropagation()
                    // ask the user if they are sure they would like to
                    // remove the file
                    const confirmed = window.confirm(
                      'are you sure you want to remove the data?'
                    )
                    if (confirmed) {
                      // if we removed the deck you are looking at clear
                      // the current deck context
                      if (deck.name === currentDeckContext.deck.name) {
                        // this means you are now not looking at a deck "default state"
                        currentDeckContext.setCurrentDeck(null)
                      }
                      sendMessage(MSG_REMOVE_FILE, deck.file)
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
}

export default Navigation
