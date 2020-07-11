import React from 'react'
import Layout from './components/Layout'
import FlashCard from './components/FlashCard'
import * as savedItems from './data/sample.json'
import Grid from '@material-ui/core/Grid'
import useLayoutStyles from './components/Layout/styles'

function App() {
  const classes = useLayoutStyles()

  return (
    <main className={classes.root}>
      <Layout>
        {/* <pre>{JSON.stringify(savedItems, null, 2)}</pre> */}
        <Grid container spacing={3}>
          {savedItems.default
            .filter((item) => item.word && item.wordDefinition)
            .map((item) => (
              <Grid item xs="12" sm="3">
                <FlashCard word={item.word} answer={item.wordDefinition} />
              </Grid>
            ))}
        </Grid>
      </Layout>
    </main>
  )
}

export default App
