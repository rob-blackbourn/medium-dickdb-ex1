import { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { fetchCityData } from './dataApi'
import { useDuckDB } from '@jetblack/duckdb-react'

import RoutedApp from './RoutedApp'

export default function DataApp() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { db } = useDuckDB()

  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const cities = await fetchCityData()
      console.log(cities)
      console.log('Saving file')
      await db.registerFileText('cities.json', JSON.stringify(cities))
      const con = await db.connect()
      await con.insertJSONFromPath('cities.json', {
        name: 'city'
      })
      console.log('Table loaded')

      await con.close()

      setIsInitialized(true)
    }

    asyncFunc().catch(console.error)
  }, [db])

  console.log(isInitialized)

  if (!isInitialized) {
    return (
      <Stack direction="column" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Typography variant="caption">Loading data</Typography>
      </Stack>
    )
  }

  return (
    <Container>
      <Paper>
        <RoutedApp />
      </Paper>
    </Container>
  )
}
