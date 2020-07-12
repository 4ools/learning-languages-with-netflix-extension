import React, { useState, useEffect } from 'react'
import useModalStyles from './styles'
import Modal from '@material-ui/core/Modal'

const ModalWindow = ({ open, children }) => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    console.log('open changed')
    setOpen(open)
  }, [open])

  const classes = useModalStyles()

  return (
    <Modal open={isOpen} onClose={() => setOpen(false)}>
      <div className={classes.paper}>{children}</div>
    </Modal>
  )
}

export default ModalWindow
