import React, { useContext } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import AppBar from '@material-ui/core/AppBar'
import useNavigationStyles from './styles'
import { DarkModeContext } from '../Theme/DarkModeContext'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const CustomAppBar = () => {
  const classes = useNavigationStyles()
  const { darkMode, setDarkMode } = useContext(DarkModeContext)
  const currentMode = darkMode !== undefined ? Boolean(darkMode) : false

  return (
    <AppBar
      // @TODO come back to this shit
      color={currentMode ? 'inherit' : 'primary'}
      position="fixed"
      style={{ zIndex: 3000 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          LLN companion app
        </Typography>
        <FormControlLabel
          control={
            <Switch
              color="secondary"
              checked={currentMode}
              onChange={(event) => {
                setDarkMode(event.target.checked)
              }}
              name="DarkMode"
            />
          }
          label="Dark Mode"
        />
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
