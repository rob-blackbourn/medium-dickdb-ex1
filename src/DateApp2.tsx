import { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useDuckDB } from '@jetblack/duckdb-react'

import RoutedApp from './RoutedApp'
// import { tableFromJSON } from '@apache-arrow/ts'
import * as arrow from 'apache-arrow'

export default function DataApp() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { db } = useDuckDB()

  // Local table.
  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const con = await db.connect()

      const json = [
        { a: 1, b: 11 },
        { a: 2, b: 22 }
      ]

      const table = arrow.tableFromJSON(json)
      await con.insertArrowTable(table, {
        name: 'local_table',
        create: true
      })

      await con.close()

      setIsInitialized(true)
    }

    asyncFunc().catch(console.error)
  }, [db])

  // Local table vi ipc.
  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const con = await db.connect()

      const json = [
        { a: 1, b: 11 },
        { a: 2, b: 22 }
      ]

      const table = arrow.tableFromJSON(json)
      const buffer = arrow.tableToIPC(table, 'stream')
      await con.insertArrowFromIPCStream(buffer, {
        name: 'local_table_ipc',
        create: true
      })

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
