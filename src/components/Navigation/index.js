import React, { useContext, useState } from 'react'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import DeleteIcon from '@material-ui/icons/Delete'
import Drawer from '@material-ui/core/Drawer'
import CustomAppBar from './CustomAppBar'
import DeckIcon from './DeckIcon'
import useNavigationStyles from './styles'
import { CurrentDeckContext } from '../CurrentDeck'
import { AllDecksContext } from '../AllDecks'
import { sendMessage } from '../../util/message'
import messageTypes from '../../util/message-types'

const Navigation = () => {
  const classes = useNavigationStyles()
  const currentDeckContext = useContext(CurrentDeckContext)
  const { allDecks } = useContext(AllDecksContext)

  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <>
      <CustomAppBar />
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
                sendMessage(messageTypes.MSG_GET_PRACTICE_CARDS)
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
            {allDecks.map((deck, index) => (
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
                  <DeckIcon rating={deck.rating} color="secondary" />
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
                      sendMessage(messageTypes.MSG_REMOVE_FILE, deck.file)
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
