import CssBaseline from '@mui/material/CssBaseline'

import DuckDB from '@jetblack/duckdb-react'
import { ConsoleLogger, LogLevel } from '@duckdb/duckdb-wasm'

import bundles from './bundles'

import DataApp from './DateApp2'

export default function App() {
  const logger = new ConsoleLogger(LogLevel.DEBUG)

  return (
    <CssBaseline>
      <DuckDB bundles={bundles} logger={logger}>
        <DataApp />
      </DuckDB>
    </CssBaseline>
  )
}
