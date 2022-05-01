
import type { Logger } from '@/utils/admin/classes'
import type { UserImportRecord } from 'firebase-admin/auth'
import type { BulkUser, DataSource } from '@/types/share'
import AuthService from '@/services/admin/auth'
import { uniq } from '@/utils/admin/helpers'
import { authSecretKey } from '@/secrets/firebaseConfig'

export default class AuthStorage {
  private SINGLE_CALL_LIMIT: number = 1000
  private USER_COUNT: number = 3010
  private BUFFERED_KEY: Buffer = Buffer.from(authSecretKey)
  private logger: Logger
  private service: typeof AuthService

  constructor(logger: Logger, service: typeof AuthService) {
    this.logger = logger
    this.service = service
  }

  async addUsers(users: BulkUser[]) {
    // add users, and return success result
    const set = new Set()
    const copyUsers = [...users]

    do {
      let partition = copyUsers.splice(0, this.SINGLE_CALL_LIMIT)

      const record = partition.map((user: BulkUser): UserImportRecord => {
        return {
          uid: user.uid,
          email: user.email,
          passwordHash: user.passwordHash,
          passwordSalt: user.passwordSalt
        }
      })

      const successRecords = await this.service.addUsers(record, {
        hash: {
          algorithm: 'HMAC_SHA256',
          key: this.BUFFERED_KEY
        }
      })

      successRecords.forEach((user) => {
        set.add(user.uid)
      })

    } while (copyUsers.length > 0);

    return users.filter(user => set.has(user.uid))
  }

  async getUsers() {
    // retrieve users
    const totalUsers = []
    let nextPageToken: string | undefined

    do {
      const result = await this.service.listUsers(this.SINGLE_CALL_LIMIT, nextPageToken)
      totalUsers.push(...result.users)
      nextPageToken = result.nextPageToken
    } while (nextPageToken !== undefined);

    return totalUsers
  }

  async deleteUsers(uids: string[]) {
    // delete user by uid
    do {
      const partition = uids.splice(0, this.SINGLE_CALL_LIMIT)
      const result = await this.service.deleteUsers(partition)

      uids.push(...result)
    } while (uids.length > 0);

    return true
  }

  async clear() {
    // use service to clear the Auth
    const userList = await this.getUsers()
    const uids = userList.map(user => user.uid)
    return await this.deleteUsers(uids)
  }

  async initialize(dataSource: DataSource) {
    // clear Auth first, get users from dataSource, then add users to Auth
    let action = 'Clear Auth Users'

    this.logger.print('BEGIN', action)
    await this.clear()
    this.logger.print('END', action)

    let totalUsers: BulkUser[] = []

    action = 'Create Auth Users'
    this.logger.print('BEGIN', action)

    do {
      let count: number = this.USER_COUNT - totalUsers.length
      let result = await dataSource.get(count)

      if (result.status === 'success') {
        const passedRecords = await this.addUsers(result.data)

        totalUsers.push(...passedRecords)
        totalUsers = uniq(totalUsers, 'uid')
      }

    } while (totalUsers.length < this.USER_COUNT);

    this.logger.print('END', action)

    return totalUsers
  }
}
