import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import 'fontsource-roboto/latin-ext.css'
import Container from '@material-ui/core/Container'
import useLayoutStyles from './styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import useCardDecks from '../hooks/useCardDecks'

const Layout = ({ children }) => {
  const classes = useLayoutStyles()

  // this hook gives us all the files in the FS that have decks
  const decks = useCardDecks()

  return (
    <main className={classes.root}>
      <CssBaseline />
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
            <ListItem>
              <Typography variant="h6">Flash cards</Typography>
            </ListItem>
            {decks.map((deck, index) => (
              <ListItem button key={`card-deck-in-nav-${index}`}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={deck.name} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="h6">...</Typography>
            </ListItem>
            {/* {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))} */}
          </List>
        </div>
      </Drawer>
      <Container maxwidth="sm">
        <Toolbar />
        {children}
      </Container>
    </main>
  )
}

export default Layout
