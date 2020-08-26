import { makeStyles } from '@material-ui/core/styles'
const drawerWidth = 260
const useNavigationStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    paddingTop: 20,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.success.main
        : theme.palette.primary.main,
  },
}))

export default useNavigationStyles
