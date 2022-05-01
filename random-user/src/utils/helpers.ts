import { VALID_TAB, VALID_LIST_FORMAT, VALID_PAGE_SIZE } from "@/utils/constants"

export const isSame = (str1: string, str2: string) => {
  return str1 === str2
}

function getValidOption<T>(options: T[], input: T | null): T {
  if (input === null) {
    return options[0]
  }

  if (options.includes(input)) {
    return input
  } else {
    return options[0]
  }
}

export const getValidTab = (format: string | null) => {
  return getValidOption<string>(VALID_TAB, format)
}

export const getValidListFormat = (format: string | null) => {
  return getValidOption<string>(VALID_LIST_FORMAT, format)
}

export const getValidPageSize = (pageSize: number | string | null) => {
  pageSize = Number(pageSize)

  return getValidOption<number>(VALID_PAGE_SIZE, pageSize)
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
