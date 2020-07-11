import { makeStyles } from '@material-ui/core/styles'

const useFlashCardStyles = makeStyles({
  root: {
    padding: '20px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: (props) => (props.shown ? 'yellow' : 'white'),
  },
})

export default useFlashCardStyles
