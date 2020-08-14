import React from 'react'
import 'fontsource-roboto/latin-ext.css'
import Container from '@material-ui/core/Container'
import useLayoutStyles from './styles'
import Toolbar from '@material-ui/core/Toolbar'
import Theme from '../Theme'
import Navigation from '../Navigation'
import { CurrentDeckProvider } from '../CurrentDeck'
import { DarkModeProvider } from '../Theme/DarkModeContext'

const Layout = ({ children }) => {
  const classes = useLayoutStyles()

  return (
    <main className={classes.root}>
      <DarkModeProvider>
        <Theme>
          <CurrentDeckProvider>
            <Navigation />
            <Container maxwidth="sm" style={{ height: 'calc(100% - 64px)' }}>
              <Toolbar />
              {children}
            </Container>
          </CurrentDeckProvider>
        </Theme>
      </DarkModeProvider>
    </main>
  )
}

export default Layout
