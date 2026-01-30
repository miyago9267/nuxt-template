const byteToHex = Array.from({ length: 256 }, (_, i) => (i + 0x100).toString(16).slice(1))

const legacyNanoid = (length: number): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

const bytesToUuid = (bytes: Uint8Array): string => {
  const getByte = (index: number) => bytes[index] ?? 0
  const setByte = (index: number, value: number) => {
    bytes[index] = value & 0xff
    return bytes[index]
  }

  setByte(6, (getByte(6) & 0x0f) | 0x40)
  setByte(8, (getByte(8) & 0x3f) | 0x80)

  const hex = (index: number) => byteToHex[getByte(index)] ?? '00'

  return (
    hex(0) + hex(1) + hex(2) + hex(3) + '-'
    + hex(4) + hex(5) + '-'
    + hex(6) + hex(7) + '-'
    + hex(8) + hex(9) + '-'
    + hex(10) + hex(11) + hex(12) + hex(13) + hex(14) + hex(15)
  )
}

export const generateUuid = (): string => {
  if (typeof globalThis.crypto !== 'undefined') {
    if (typeof globalThis.crypto.randomUUID === 'function') {
      return globalThis.crypto.randomUUID()
    }
    if (typeof globalThis.crypto.getRandomValues === 'function') {
      const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
      return bytesToUuid(bytes)
    }
  }

  const fallback = new Uint8Array(16)
  for (let i = 0; i < fallback.length; i++) {
    fallback[i] = Math.floor(Math.random() * 256)
  }
  return bytesToUuid(fallback)
}

export const nanoid = (length?: number): string => {
  if (length && length !== 36) {
    return legacyNanoid(length)
  }
  return generateUuid()
}
