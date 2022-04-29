
import AuthService from '@/services/Admin/Auth'
import type { Logger, UserSource } from '@/utils/admin/classes'
import { uniq } from '@/utils/admin/helpers'
import type { UserImportRecord } from 'firebase-admin/auth'
import type { BulkUser } from '@/types/share'
import { authSecretKey } from '@/secrets/firebaseConfig'
import { SINGLE_CALL_LIMIT } from '@/utils/constants'

export default class AuthStorage {
  private USER_COUNT: number = 3010
  private BUFFERED_KEY: Buffer = Buffer.from(authSecretKey)
  private logger: Logger
  private dataSource: UserSource

  constructor(logger: Logger, dataSource: UserSource) {
    this.logger = logger
    this.dataSource = dataSource
  }

  private async addUsers<T extends typeof AuthService>(service: T, users: BulkUser[]) {
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

  private async getUsers<T extends typeof AuthService>(service: T) {
    const totalUsers = []
    let nextPageToken: string | undefined

    do {
      const result = await service.listUsers(SINGLE_CALL_LIMIT, nextPageToken)
      totalUsers.push(...result.users)
      nextPageToken = result.nextPageToken
    } while (nextPageToken !== undefined);

    return totalUsers
  }

  private async deleteUsers<T extends typeof AuthService>(service: T, uids: string[]) {
    do {
      const partition = uids.splice(0, SINGLE_CALL_LIMIT)
      const result = await service.deleteUsers(partition)

      uids.push(...result)
    } while (uids.length > 0);

    return true
  }

  private async clear() {
    const userList = await this.getUsers(AuthService)
    const uids = userList.map(user => user.uid)
    return await this.deleteUsers(AuthService, uids)
  }

  async initialize() {
    let action = 'Clear Auth Users'

    this.logger.print('BEGIN', action)
    await this.clear()
    this.logger.print('END', action)

    let totalUsers: UserImportRecord[] = []

    action = 'Create Auth Users'
    this.logger.print('BEGIN', action)

    do {
      let count: number = this.USER_COUNT - totalUsers.length
      let result = await this.dataSource.get(count)

      if (result.status === 'success') {
        const passedRecords = await this.addUsers(AuthService, result.data)

        totalUsers.push(...passedRecords)
        totalUsers = uniq(totalUsers, 'uid')
      }

    } while (totalUsers.length < this.USER_COUNT);

    this.logger.print('END', action)

    return totalUsers
  }
}
