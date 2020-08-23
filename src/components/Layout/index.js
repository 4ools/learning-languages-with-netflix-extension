import React from 'react'
import 'fontsource-roboto/latin-ext.css'
import Container from '@material-ui/core/Container'
import useLayoutStyles from './styles'
import Toolbar from '@material-ui/core/Toolbar'
import Theme from '../Theme'
import Navigation from '../Navigation'
import { CurrentDeckProvider } from '../CurrentDeck'
import { DarkModeProvider } from '../Theme/DarkModeContext'
import { AllDecksProvider } from '../AllDecks'
import FloatingActionButton from '../FloatingActionButton'

const Layout = ({ children }) => {
  const classes = useLayoutStyles()

  return (
    <main className={classes.root}>
      <DarkModeProvider>
        <Theme>
          <CurrentDeckProvider>
            <AllDecksProvider>
              <Navigation />
              <Container maxwidth="sm" style={{ height: 'calc(100% - 64px)' }}>
                <Toolbar />
                {children}
              </Container>
              <FloatingActionButton />
            </AllDecksProvider>
          </CurrentDeckProvider>
        </Theme>
      </DarkModeProvider>
    </main>
  )
}

export default Layout
