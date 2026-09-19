const NAMESPACE = 'foodbridge:v1:'

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(NAMESPACE + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode, quota) — fail silently, app still works in-memory
  }
}

export function seedOnce(key, seedValue) {
  const existing = readStore(key, null)
  if (existing === null) {
    writeStore(key, seedValue)
    return seedValue
  }
  return existing
}
