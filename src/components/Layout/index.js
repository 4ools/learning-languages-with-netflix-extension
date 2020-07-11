import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import 'fontsource-roboto/latin-ext.css'
import Container from '@material-ui/core/Container'
import useLayoutStyles from './styles'

const Layout = ({ children }) => {
  const classes = useLayoutStyles()
  return (
    <main className={classes.root}>
      <CssBaseline />
      <Container maxwidth="sm">{children}</Container>
    </main>
  )
}

export default Layout
