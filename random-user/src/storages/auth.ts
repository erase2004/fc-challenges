
import type AuthService from '@/services/Admin/Auth'
import type { Logger } from '@/utils/admin/classes'
import type { UserImportRecord } from 'firebase-admin/auth'
import type { BulkUser, DataSource } from '@/types/share'
import { uniq } from '@/utils/admin/helpers'
import { authSecretKey } from '@/secrets/firebaseConfig'
import { SINGLE_CALL_LIMIT } from '@/utils/constants'

export default class AuthStorage {
  private USER_COUNT: number = 3010
  private BUFFERED_KEY: Buffer = Buffer.from(authSecretKey)
  private logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  async addUsers<T extends typeof AuthService>(service: T, users: BulkUser[]) {
    // use service to add users, and resturn success result
    const passedRecords = []

    do {
      let partition = users.splice(0, SINGLE_CALL_LIMIT)

      const record = partition.map((user: BulkUser): UserImportRecord => {
        return {
          uid: user.email,
          email: user.email,
          passwordHash: user.passwordHash,
          passwordSalt: user.passwordSalt
        }
      })

      const successRecords = await service.addUsers(record, {
        hash: {
          algorithm: 'HMAC_SHA256',
          key: this.BUFFERED_KEY
        }
      })

      passedRecords.push(...successRecords)

    } while (users.length > 0);

    return passedRecords
  }

  async getUsers<T extends typeof AuthService>(service: T) {
    // use service to retrieve users
    const totalUsers = []
    let nextPageToken: string | undefined

    do {
      const result = await service.listUsers(SINGLE_CALL_LIMIT, nextPageToken)
      totalUsers.push(...result.users)
      nextPageToken = result.nextPageToken
    } while (nextPageToken !== undefined);

    return totalUsers
  }

  async deleteUsers<T extends typeof AuthService>(service: T, uids: string[]) {
    // use service to delete user by uid
    do {
      const partition = uids.splice(0, SINGLE_CALL_LIMIT)
      const result = await service.deleteUsers(partition)

      uids.push(...result)
    } while (uids.length > 0);

    return true
  }

  async clear(service: typeof AuthService) {
    // use service to clear the Auth
    const userList = await this.getUsers(service)
    const uids = userList.map(user => user.uid)
    return await this.deleteUsers(service, uids)
  }

  async initialize(dataSource: DataSource, service: typeof AuthService) {
    // clear Auth first, get users from dataSource, then add users to Auth
    let action = 'Clear Auth Users'

    this.logger.print('BEGIN', action)
    await this.clear(service)
    this.logger.print('END', action)

    let totalUsers: UserImportRecord[] = []

    action = 'Create Auth Users'
    this.logger.print('BEGIN', action)

    do {
      let count: number = this.USER_COUNT - totalUsers.length
      let result = await dataSource.get(count)

      if (result.status === 'success') {
        const passedRecords = await this.addUsers(service, result.data)

        totalUsers.push(...passedRecords)
        totalUsers = uniq(totalUsers, 'uid')
      }

    } while (totalUsers.length < this.USER_COUNT);

    this.logger.print('END', action)

    return totalUsers
  }
}
