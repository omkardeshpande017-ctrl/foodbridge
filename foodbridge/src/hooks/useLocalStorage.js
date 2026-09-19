import { useState } from 'react'
import { readStore, writeStore } from '../utils/storage'

export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => readStore(key, fallback))

  const update = (next) => {
    const resolved = typeof next === 'function' ? next(value) : next
    setValue(resolved)
    writeStore(key, resolved)
  }

  return [value, update]
}
