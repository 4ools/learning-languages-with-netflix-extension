import React from 'react'
import { Box } from '@material-ui/core'
import { Typography } from '@material-ui/core'

const EmptyState = ({ title, children, max }) => (
  <Box
    width="100%"
    height="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
  >
    <Box mb={3}>
      <Typography variant="h5" style={{ textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
    <Box m="0 auto" width="50%" maxWidth={`${max}px`}>
      {children}
    </Box>
  </Box>
)

export default EmptyState
