import React from 'react';
import Layout from './components/Layout'
import * as savedItems from './data/sample.json'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';


function App() {

  return (
    <Layout>
      {/* <pre>{JSON.stringify(savedItems, null, 2)}</pre> */}
      <Grid container spacing={3}>
        {savedItems.default.filter(item => item.word).map(item => (
          <Grid item xs="12" sm="3">
            <Card styles={{padding: '20px'}}>
              {item.word}
            </Card>
          </Grid>
        ))}
      </Grid>


    </Layout>
  )
}

export default App;
