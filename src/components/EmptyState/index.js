import React from 'react'
import { Box } from '@material-ui/core'

const EmptyState = ({ children }) => (
  <Box
    width="100%"
    height="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Box m="0 auto" width="50%">
      {children}
    </Box>
  </Box>
)

export default EmptyState
