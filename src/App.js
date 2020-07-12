import React from 'react'
import Layout from './components/Layout'
import FlashCardPage from './components/FlashCardPage'
import UploadCards from './components/UploadCards'

function App() {
  return (
    <Layout>
      <FlashCardPage />
      <UploadCards />
    </Layout>
  )
}

export default App
