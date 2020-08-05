import React from 'react'
import 'fontsource-roboto/latin-ext.css'
import Container from '@material-ui/core/Container'
import useLayoutStyles from './styles'
import Toolbar from '@material-ui/core/Toolbar'
import Theme from '../Theme'
import Navigation from '../Navigation'
import { CurrentDeckProvider } from '../CurrentDeck'

const Layout = ({ children }) => {
  const classes = useLayoutStyles()

  return (
    <main className={classes.root}>
      <Theme>
        <CurrentDeckProvider>
          <Navigation />
          <Container maxwidth="sm">
            <Toolbar />
            {children}
          </Container>
        </CurrentDeckProvider>
      </Theme>
    </main>
  )
}

export default Layout
