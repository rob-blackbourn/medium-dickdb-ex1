import { ApiClientOptions, fromCatalog } from '@opendatasoft/api-client'
import { batchQuery } from './opendatasoftUtils'

export type City = {
  name: string
  country: string
  countryCode: string
  population: number
  latitude: number
  longitude: number
}

type CityDTA = {
  name: string
  country_code: string
  cou_name_en: string
  population: number
  coordinates: {
    lon: number
    lat: number
  }
}

const reshapeCity = (city: CityDTA): City => ({
  name: city.name,
  country: city.cou_name_en,
  countryCode: city.country_code,
  population: city.population,
  latitude: city.coordinates.lat,
  longitude: city.coordinates.lon
})

export async function fetchCityData(): Promise<City[]> {
  const options: ApiClientOptions = { domain: 'documentation-resources' }
  const query = fromCatalog() // From the domain catalog
    .dataset('geonames-all-cities-with-a-population-1000')
    .records()
    .where('population > 100000')
    .select('name,country_code,population,cou_name_en,coordinates')
  const responses = await batchQuery<CityDTA>(query, options, 100)
  const cities = responses.flatMap(response =>
    response.results.map(reshapeCity)
  )
  return cities
}
