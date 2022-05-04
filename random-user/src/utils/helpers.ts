export function isSame(str1: string, str2: string) {
  return str1 === str2
}

export function getValidOption<T>(options: T[], input: T | null): T {
  if (input === null) {
    return options[0]
  }

  if (options.includes(input)) {
    return input
  } else {
    return options[0]
  }
}

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
