import { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useDuckDB } from '@jetblack/duckdb-react'

import RoutedApp from './RoutedApp'
import { loadTableFromBase64Ipc2, loadTableFromResponse } from './duckdbUtils'
// import { sqlJson } from './duckdbUtils'

export default function DataApp() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { db } = useDuckDB()

  // Local file.
  // useEffect(() => {
  //   if (!db) {
  //     return
  //   }

  //   const asyncFunc = async () => {
  //     const cities = await fetchCityData()
  //     console.log(cities)
  //     console.log('Saving file')
  //     await db.registerFileText('cities.json', JSON.stringify(cities))
  //     const con = await db.connect()
  //     await con.insertJSONFromPath('cities.json', {
  //       name: 'city'
  //     })
  //     console.log('Table loaded')

  //     await con.close()

  //     setIsInitialized(true)
  //   }

  //   asyncFunc().catch(console.error)
  // }, [db])

  // GET base64 IPC
  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const con = await db.connect()
      const response = await fetch(
        'https://brick.jetblack.net:9009/table_ipc_b64'
      )
      const text = await response.text()
      await loadTableFromBase64Ipc2(text, 'table_ipc_b64', con)
    }

    asyncFunc()
      .then(() => setIsInitialized(true))
      .catch(error => console.log(error))
  }, [db])

  // GET IPC
  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const connection = await db.connect()
      const response = await fetch('https://brick.jetblack.net:9009/table_ipc')
      const arrayBuffer = await response.arrayBuffer()
      const buf = new Uint8Array(arrayBuffer)
      await connection.insertArrowFromIPCStream(buf, {
        name: 'table_ipc',
        create: true
      })
    }

    asyncFunc()
      .then(() => setIsInitialized(true))
      .catch(error => console.log(error))
  }, [db])

  // loadTableFromIpc
  useEffect(() => {
    if (!db) {
      return
    }

    const asyncFunc = async () => {
      const connection = await db.connect()
      const response = await fetch('https://brick.jetblack.net:9009/titanic')
      await loadTableFromResponse(response, 'titanic', connection)
    }

    asyncFunc()
      .then(() => setIsInitialized(true))
      .catch(error => console.log(error))
  }, [db])

  // useEffect(() => {
  //   if (!db) {
  //     return
  //   }

  //   const asyncEffect = async () => {
  //     // const table = await tableFromIPC(
  //     //   fetch('https://brick.jetblack.net:9009/table')
  //     // )
  //     const EOS = new Uint8Array([255, 255, 255, 255, 0, 0, 0, 0])
  //     const table = tableFromJSON([
  //       { name: 'Rob', age: 56 },
  //       { name: 'Ann-Marie', age: 50 }
  //     ])
  //     const data = [...table]
  //     console.table(data)
  //     const connection = await db.connect()
  //     // await connection.query('CREATE TABLE titanic(name VARCHAR, age integer)')
  //     console.log('inserting table')
  //     await connection.insertArrowTable(table, {
  //       name: 'titanic'
  //     })
  //     await connection.insertArrowTable(EOS, {
  //       name: 'arrow_table'
  //     })
  //     // const json = await sqlJson('SELECT * FROM titanic', connection)
  //     // console.log(json)
  //   }

  //   asyncEffect()
  //     .then(() => {
  //       console.log('Loaded')
  //       setIsInitialized(true)
  //     })
  //     .catch(error => console.error(error))
  // }, [db])

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
