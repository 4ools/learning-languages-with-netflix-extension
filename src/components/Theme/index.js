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
          background: {
            default: prefersDarkMode ? '#15232d' : '#efefef',
            paper: prefersDarkMode ? '#193549' : '#fff',
          },
          primary: {
            light: 'hsla(212, 72%, 34%, 0.30)',
            main: '#185294',
          },
          secondary: {
            main: '#ff9d00',
          },
          success: {
            light: 'hsla(212, 72%, 34%, 0.30)',
            main: '#185294',
          },
          error: {
            main: '#A22929',
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
