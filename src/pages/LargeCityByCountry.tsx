import { useEffect, useState } from 'react'

import { useDuckDB } from '@jetblack/duckdb-react'

import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import Stack from '@mui/material/Stack'

import { DataTable, Column } from '@jetblack/material-data-table'

import SubmitForm from '../components/SubmitForm'

import { arrowRowGenerator } from '../duckdbUtils'

const formatPopulation = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0
}).format

type City = {
  country: string
  name: string
  population: number
}

export default function LargeCityByCountry() {
  const { db } = useDuckDB()
  const [cities, setCities] = useState<City[]>()
  const [maxCities, setMaxCities] = useState(3)
  const [minPopulation, setMinPopulation] = useState(1000000)

  useEffect(() => {
    if (!db) {
      return
    }

    const loadAsync = async () => {
      const connection = await db.connect()
      const results = await connection.query(`
      WITH x AS (
        SELECT
          RANK() OVER (PARTITION BY country ORDER BY population DESC) as rank,
          country,
          name,
          population
        FROM
          city
        GROUP BY
          country,
          name,
          population
      )
      SELECT
        *
      FROM
        x
      WHERE
        rank <= ${maxCities}
      AND
        population > ${minPopulation}
      ORDER BY
        country,
        name,
        population DESC
      `)
      const cities = Array.from<City>(arrowRowGenerator<City>(results))
      return cities
    }

    loadAsync().then(setCities).catch(console.error)
  }, [db, maxCities, minPopulation])

  const columns: Column<City>[] = [
    {
      id: 'country',
      title: 'Country'
    },
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
    <Stack direction="column">
      <FormContainer
        defaultValues={{
          maxCities: 3,
          minPopulation: 1000000
        }}
        onSuccess={data => {
          setMaxCities(data.maxCities)
          setMinPopulation(data.minPopulation)
        }}
      >
        <TextFieldElement
          name="maxCities"
          label="Max Cities"
          type="number"
          required
        />
        <TextFieldElement
          name="minPopulation"
          label="Min Population"
          type="number"
          required
        />
        <SubmitForm names={['maxCities', 'minPopulation']} />
      </FormContainer>

      <DataTable<City>
        rows={cities || []}
        columns={columns}
        paginate={true}
        size="small"
        sx={{ width: 'fit-content' }}
      />
    </Stack>
  )
}
