import { Table } from '@apache-arrow/ts'

const reviveRow = <T>(
  row: Record<string, unknown>,
  reviver: (key: string, value: unknown) => unknown
): T =>
  Object.entries(row).reduce<T>(
    (obj, [key, value]) => ({
      ...obj,
      [key]: reviver(key, value)
    }),
    {} as T
  )

export function* arrowRowGenerator<T>(
  table: Table,
  reviver?: (key: string, value: unknown) => T
) {
  for (let i = 0; i < table.numRows; ++i) {
    // Get the row as JSON.
    const row = table.get(i)?.toJSON() as Record<string, unknown> | null

    if (row === null) {
      // I'm not sure if rows can be null, or if this is an artifact of the
      // implementation.
      continue
    }

    if (reviver) {
      yield reviveRow<T>(row, reviver)
    } else {
      yield row as T
    }
  }
}
