import { makeStyles } from '@material-ui/core/styles'
const useFabStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 9999,
  },
}))

export default useFabStyles
