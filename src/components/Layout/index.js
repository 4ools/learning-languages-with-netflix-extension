import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const Layout = ({children}) => (
    <>
    <CssBaseline />
    <Container maxwidth="sm">
      {children}
    </Container>
  </>
)

export default Layout;