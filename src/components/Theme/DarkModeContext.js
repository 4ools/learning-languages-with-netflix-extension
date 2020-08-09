import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { onMessage, sendMessage, MSG_SET_DARK_MODE } from '../../util/message'

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

  // if elecron sets it, then also toggle it
  useEffect(() => {
    // only do this once else you will end up with multiple on events and
    // get warnings in the console from node:
    // https://www.stefanjudis.com/today-i-learned/nodejs-sends-warnings-when-you-add-too-many-listeners-to-an-event-emitter/
    onMessage(MSG_SET_DARK_MODE, (_, mode) => {
      if (mode !== undefined) {
        setDarkMode(mode)
      }
    })
  }, [])

  const setTheCookie = (newValue) => {
    if (typeof newValue !== 'boolean') {
      console.warn('cannot set the cookie value as anything other than bool')
      return
    }
    setDarkMode(newValue)
    setCookie(DARK_MODE_COOKIE, newValue)
    sendMessage(MSG_SET_DARK_MODE, newValue)
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
