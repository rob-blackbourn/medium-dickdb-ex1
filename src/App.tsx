import CssBaseline from '@mui/material/CssBaseline'

import DuckDB from '@jetblack/duckdb-react'

import bundles from './bundles'

import DataApp from './DataApp'

export default function App() {
  return (
    <CssBaseline>
      <DuckDB bundles={bundles}>
        <DataApp />
      </DuckDB>
    </CssBaseline>
  )
}
