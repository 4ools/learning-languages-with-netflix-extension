import { makeStyles } from '@material-ui/core/styles'

const minCardHeight = '350px'

const useFlashCardStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    minHeight: minCardHeight,
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
  flipContainer: {
    position: 'relative',
    minHeight: minCardHeight,
  },
  back: {
    position: 'absolute',
    willChange: 'transform, opacity',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  front: {
    position: 'absolute',
    willChange: 'transform, opacity',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  emptyCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionArea: {
    backgroundColor: theme.palette.secondary.main,
    margin: '0 -20px -20px -20px',
  },
  actionBox: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rateText: {
    color: theme.palette.success.main,
  },
}))

export default useFlashCardStyles
