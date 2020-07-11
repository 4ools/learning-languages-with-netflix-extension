import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import useFlashCardStyles from './sytles'

const FlashCard = ({ word, answer }) => {
  const [shown, setShown] = useState(false)
  const flashCardClassed = useFlashCardStyles({ shown })

  return (
    <Card className={flashCardClassed.root} onClick={() => setShown(true)}>
      {shown ? answer : word}
    </Card>
  )
}

export default FlashCard
