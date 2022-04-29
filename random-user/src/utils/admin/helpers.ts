export function uniq<T extends object, U extends keyof T>(objectArray: T[], key: U) {
  const set = new Set()
  const result: T[] = []

  for (let object of objectArray) {
    const value = object[key]

    if (set.has(value) === false) {
      set.add(value)
      result.push(object)
    }
  }

  return result
}