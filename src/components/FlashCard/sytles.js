import { makeStyles } from '@material-ui/core/styles'

const useFlashCardStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    color: (props) =>
      props.shown ? theme.palette.common.white : theme.palette.text.primary,
    backgroundColor: (props) =>
      props.shown ? theme.palette.success.main : theme.palette.background.paper,
  },
}))

export default useFlashCardStyles
