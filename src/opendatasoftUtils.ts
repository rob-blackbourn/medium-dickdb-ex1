import { ApiClient, ApiClientOptions, Query } from '@opendatasoft/api-client'

type OpenDataSoftResponse<T> = {
  total_count: number
  results: T[]
}

export async function batchQuery<T>(
  query: Query,
  options: ApiClientOptions,
  batchSize: number
): Promise<OpenDataSoftResponse<T>[]> {
  const client = new ApiClient(options)

  let limit = 2
  let offset = 0
  const responses: OpenDataSoftResponse<T>[] = []
  while (
    responses.length === 0 ||
    offset < responses[responses.length - 1].total_count
  ) {
    console.log({ limit, offset })
    const url = query.limit(limit).offset(offset).toString()

    // Now, run the query.
    const response: OpenDataSoftResponse<T> = await client.get(url)
    offset += response.results.length
    limit = Math.min(batchSize, response.total_count - offset)
    responses.push(response)
  }
  return responses
}
