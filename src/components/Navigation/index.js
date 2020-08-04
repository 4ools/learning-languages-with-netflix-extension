import React from 'react'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import DeleteIcon from '@material-ui/icons/Delete'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import useCardDecks from '../hooks/useCardDecks'
import useNavigationStyles from './styles'

const Navigation = () => {
  // this hook gives us all the files in the FS that have decks
  const decks = useCardDecks()
  const classes = useNavigationStyles()

  return (
    <>
      <AppBar position="fixed" style={{ zIndex: 3000 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            LLN companion app
          </Typography>
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
          <List>
            <ListItem button>
              <ListItemIcon>
                <FitnessCenterIcon />
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
          <List>
            {decks.map((deck, index) => (
              <ListItem button key={`card-deck-in-nav-${index}`}>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary={deck.name} />
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
}

export default Navigation
