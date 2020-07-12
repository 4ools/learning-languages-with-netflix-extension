import React, { useState, useEffect } from 'react'
import ModalWindow from '../ModalWindow'

const UploadCards = () => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // we do not have this in the browser version
    window.ipcRenderer &&
      window.ipcRenderer.on('openUploads', () => setOpen(true))
  }, [])

  return (
    <ModalWindow open={isOpen}>
      <h1>this is something</h1>
    </ModalWindow>
  )
}

export default UploadCards
