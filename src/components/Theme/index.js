import React, { useContext } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { DarkModeContext } from './DarkModeContext'

const Theme = ({ children }) => {
  // this is default setting for dark mode, the one based on the machine
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  // if it was overidden then take the override
  const overrides = useContext(DarkModeContext)

  if (overrides?.darkMode !== undefined) {
    prefersDarkMode = overrides.darkMode
  }

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#3a86ff',
          },
          secondary: {
            main: '#ffbe0b',
          },
          success: {
            light: 'hsla(265, 83%, 57%, 0.30)',
            main: '#8338ec',
          },
          error: {
            main: '#ff006e',
          },
          warning: {
            main: '#fb5607',
          },
        },
      }),
    [prefersDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default Theme
