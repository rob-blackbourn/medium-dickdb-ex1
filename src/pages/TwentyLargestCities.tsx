import { useDuckDB } from '@jetblack/duckdb-react'
import { useEffect, useState } from 'react'

import { DataTable, Column } from '@jetblack/material-data-table'

import { sqlDbJson } from '../duckdbUtils'

const formatPopulation = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0
}).format

type BigCity = {
  name: string
  population: number
}

export default function TwentyLargestCities() {
  const { db } = useDuckDB()
  const [cities, setCities] = useState<BigCity[]>()

  useEffect(() => {
    if (!db) {
      return
    }

    const loadAsync = async () => {
      const cities = sqlDbJson<BigCity>(
        `
      SELECT
        name, population
      FROM
        city
      ORDER BY
        population DESC
      FETCH
        FIRST 20 ROWS ONLY
      `,
        db
      )
      return cities
    }

    loadAsync().then(setCities).catch(console.error)
  }, [db])

  const columns: Column<BigCity>[] = [
    {
      id: 'name',
      title: 'Name'
    },
    {
      id: 'population',
      title: 'Population',
      align: 'right',
      formatValue: (value: number) => formatPopulation(value)
    }
  ]

  return (
    <DataTable<BigCity>
      rows={cities || []}
      columns={columns}
      paginate={false}
      size="small"
      sx={{ width: 'fit-content' }}
    />
  )
}
