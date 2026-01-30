export type TableRowRecord = object

export const mapTableRows = <RowType extends TableRowRecord>(rows: RowType[]): RowType[] => {
  return rows.map(row => ({ ...row })) as RowType[]
}

export const trimStringFields = <Payload extends object, Keys extends keyof Payload>(
  payload: Payload,
  fields: readonly Keys[],
): Payload => {
  fields.forEach((field) => {
    const value = payload[field]
    if (typeof value === 'string') {
      payload[field] = value.trim() as Payload[Keys]
    }
  })
  return payload
}

export const normalizeNullableFields = <Payload extends object, Keys extends keyof Payload>(
  payload: Payload,
  fields: readonly Keys[],
): Payload => {
  fields.forEach((field) => {
    const value = payload[field]
    if (typeof value === 'string') {
      const trimmed = value.trim()
      payload[field] = (trimmed.length > 0 ? trimmed : null) as Payload[Keys]
    }
    else if (value === undefined) {
      payload[field] = null as Payload[Keys]
    }
  })
  return payload
}
