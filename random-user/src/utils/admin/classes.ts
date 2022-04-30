import fetch from 'cross-fetch'
import type { BulkUser, RawUser } from '@/types/share'

export class Logger {
  printFormat: string

  constructor() {
    this.printFormat = '[%s] %s'
  }

  print(status: string, str: string): void {
    console.log(`\x1b[37m${this.printFormat}\x1b[0m`, status, str)
  }

  error(err: unknown): void {
    console.error(`\x1b[31m${this.printFormat}\x1b[0m`, 'ERROR', err)
  }
}

export class UserSource {
  private API_LIMIT = 5000
  private fetchURL = 'https://randomuser.me/api/?password=upper,lower,number,6-18&inc=gender,name,email,picture,login,dob'

  generatedCount: number
  seed: string
  logger: Logger

  constructor(seed: string, logger: Logger) {
    this.generatedCount = 0
    this.seed = seed
    this.logger = logger
  }

  reset(): void {
    this.generatedCount = 0
  }

  setSeed(seed: string): void {
    this.seed = seed
  }

  async get(count: number): Promise<{
    status: 'success' | 'failed';
    data: BulkUser[]
  }> {
    // use generatedCount to keep generated users count,
    // so when getting users by count, the return result could be unique
    count = Math.min(Math.max(0, count), this.API_LIMIT)
    const page = Math.ceil(this.generatedCount / count) + 1 // 1 based index
    const url = `${this.fetchURL}&seed=${this.seed}&results=${count}&page=${page}`

    try {
      let response = await fetch(url)

      const users = await response.json()

      const data = users.results.map((user: RawUser): BulkUser => ({
        uid:  user.login.username,
        email: user.email,
        passwordHash: Buffer.from(user.login.sha256),
        passwordSalt: Buffer.from(user.login.salt),
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        avatar: user.picture.large,
        gender: user.gender
      }))

      return {
        status: 'success',
        data
      }

    } catch (error) {
      this.logger.error(error)

      return {
        status: 'failed',
        data: []
      }
    } finally {
      this.generatedCount += count
    }
  }
}