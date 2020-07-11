import { makeStyles } from '@material-ui/core/styles'

const useFlashCardStyles = makeStyles({
  root: {
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: (props) => (props.shown ? 'yellow' : 'white'),
  },
})

export default useFlashCardStyles
