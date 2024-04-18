import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm'
import { DataType, Table, TypeMap } from 'apache-arrow'

export const PARQUET_MIME_TYPE = 'application/vnd.apache.parquet'

export function* arrowRowGenerator<
  TRow,
  TTable extends { [key: string]: DataType } = TypeMap
>(table: Table<TTable>, reviver?: (value: unknown) => TRow) {
  for (let i = 0; i < table.numRows; ++i) {
    // Get the row as JSON.
    const row = table.get(i)?.toJSON() as Record<string, unknown> | null

    if (row === null) {
      // I'm not sure if rows can be null, or if this is an artifact of the
      // implementation.
      continue
    }

    if (reviver) {
      yield reviver(row)
    } else {
      yield row as TRow
    }
  }
}

const stripFileExtension = (filename: string, extensions: string[]) => {
  const parts = filename.split('.')
  const ext = parts.length > 1 ? (parts.pop() as string) : ''
  const basename = parts.join('.')
  if (extensions.includes(ext)) {
    return basename
  }
  return filename
}

const getExportedFilename = (tableName: string, extension: string) => {
  // If the table was imported with an extension, strip it.
  const basename = stripFileExtension(tableName, ['arrow', 'csv', 'parquet'])

  return basename + '.' + extension
}

export const getTempFilename = () => {
  const timestamp = Date.now().toString()
  const randomString = Math.random().toString(36).substring(2)
  return `file-${timestamp}-${randomString}`
}

export const exportParquet = async (
  db: AsyncDuckDB,
  tableName: string,
  filename?: string,
  compression: 'uncompressed' | 'snappy' | 'gzip' | 'zstd' = 'zstd'
): Promise<File> => {
  filename = filename || getExportedFilename(tableName, 'parquet')

  const tempFile = getTempFilename()
  const conn = await db.connect()
  await conn.query(
    `COPY '${tableName}' TO '${tempFile}' (FORMAT PARQUET, COMPRESSION ${compression})`
  )
  await conn.close()

  const buffer = await db.copyFileToBuffer(tempFile)
  await db.dropFile(tempFile)

  return new File([buffer], filename, { type: PARQUET_MIME_TYPE })
}

export async function writeTableToBase64Parquet(
  db: AsyncDuckDB,
  tableName: string
) {
  const parquetFile = await exportParquet(
    db,
    tableName,
    undefined,
    'uncompressed'
  )

  const buffer = await parquetFile.arrayBuffer()
  let binaryString = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; ++i) {
    binaryString += String.fromCharCode(bytes[i])
  }

  const base64 = btoa(binaryString)
  return base64
}

export async function loadTableFromBase64Ipc(
  encoded: string,
  tableName: string,
  connection: AsyncDuckDBConnection,
  dropIfExists: boolean = true
) {
  const decoded = atob(encoded)
  const buf = new Uint8Array(decoded.length)
  for (let i = 0; i < decoded.length; ++i) {
    buf[i] = decoded.charCodeAt(i)
  }

  if (dropIfExists) {
    await connection.query(`DROP TABLE IF EXISTS ${tableName}`)
  }

  await connection.insertArrowFromIPCStream(buf, {
    name: tableName,
    create: true
  })
}

export async function loadTableFromBase64Ipc2(
  encoded: string,
  tableName: string,
  connection: AsyncDuckDBConnection,
  dropIfExists: boolean = true
) {
  if (dropIfExists) {
    await connection.query(`DROP TABLE IF EXISTS ${tableName}`)
  }

  const buf = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))

  await connection.insertArrowFromIPCStream(buf, {
    name: tableName,
    create: true
  })
}

export async function loadTableFromResponse(
  response: Response,
  name: string,
  connection: AsyncDuckDBConnection,
  dropIfExists: boolean = true
) {
  if (dropIfExists) {
    await connection.query(`DROP TABLE IF EXISTS ${name}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const buf = new Uint8Array(arrayBuffer)
  await connection.insertArrowFromIPCStream(buf, {
    name,
    create: true
  })
}

export async function loadTableFromIpc2(
  encoded: string,
  tableName: string,
  connection: AsyncDuckDBConnection,
  dropIfExists: boolean = true
) {
  const buf = Uint8Array.from(encoded, c => c.charCodeAt(0))

  if (dropIfExists) {
    await connection.query(`DROP TABLE IF EXISTS ${tableName}`)
  }

  await connection.insertArrowFromIPCStream(buf, {
    name: tableName,
    create: true
  })
}

export async function sqlJson<
  TRow,
  TTable extends { [key: string]: DataType } = TypeMap
>(
  sql: string,
  connection: AsyncDuckDBConnection,
  reviver?: (value: unknown) => TRow
): Promise<TRow[]> {
  const table = await connection.query<TTable>(sql)
  return Array.from<TRow>(arrowRowGenerator<TRow, TTable>(table, reviver))
}

export async function sqlDbJson<
  TRow,
  TTable extends { [key: string]: DataType } = TypeMap
>(
  sql: string,
  db: AsyncDuckDB,
  reviver?: (value: unknown) => TRow
): Promise<TRow[]> {
  const connection = await db.connect()
  try {
    const table = await sqlJson<TRow, TTable>(sql, connection, reviver)
    return table
  } finally {
    await connection.close()
  }
}
