import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

const DARK_MODE_COOKIE = 'dark-mode'
const DarkModeContext = React.createContext(null)

const DarkModeProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies([DARK_MODE_COOKIE])
  // read a cookie and set the initial value based on the cookie
  // state for users to set dark mode and read it
  const cookieSetting = cookies[DARK_MODE_COOKIE]
    ? JSON.parse(cookies[DARK_MODE_COOKIE])
    : undefined
  const [darkMode, setDarkMode] = useState(cookieSetting)

  const setTheCookie = (newValue) => {
    if (typeof newValue !== 'boolean') {
      console.warn('cannot set the cookie value as anything other than bool')
      return
    }
    setDarkMode(newValue)
    setCookie(DARK_MODE_COOKIE, newValue)
    // @TODO tell electron to store the new cookie value if in electron
    // if (window.)
  }

  return (
    <DarkModeContext.Provider
      value={{
        darkMode,
        setDarkMode: setTheCookie,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  )
}

export { DarkModeProvider, DarkModeContext }
