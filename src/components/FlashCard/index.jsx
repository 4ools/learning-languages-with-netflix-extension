import React, { useState } from 'react'
import Card from '@material-ui/core/Card';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useFlashCardStyles = makeStyles({
  root: {
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: props => props.shown ? 'yellow' : 'white'
  },
});



const FlashCard = ({ word, answer }) => {
  const [shown, setShown] = useState(false)
  const flashCardClassed = useFlashCardStyles({shown})

 return (
  <Card className={flashCardClassed.root} onClick={() => setShown(true)}>
    {shown ? answer : word }
  </Card>
)}


export default FlashCard