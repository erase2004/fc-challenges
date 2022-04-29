
import AuthService from '@/services/Admin/Auth'
import { Logger, UserSource } from '@/utils/admin/classes'
import { uniq } from '@/utils/admin/helpers'
import type { UserImportRecord } from 'firebase-admin/auth'
import type { BulkUser } from '@/types/share'
import { authSecretKey } from '@/secrets/firebaseConfig'

const USER_COUNT = 3010
const SEED = '114514'
const SINGLE_CALL_LIMIT = 1000
const BUFFERED_KEY = Buffer.from(authSecretKey)

const logger = new Logger()
const userSource = new UserSource(SEED, logger)

async function addUsersToStorage<T extends typeof AuthService>(service: T, users: BulkUser[]) {
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
        key: BUFFERED_KEY
      }
    })

    passedRecords.push(...successRecords)

  } while (users.length > 0);

  return passedRecords
}

async function getUsersFromStorage<T extends typeof AuthService>(service: T) {
  const totalUsers = []
  let nextPageToken: string | undefined

  do {
    const result = await service.listUsers(SINGLE_CALL_LIMIT, nextPageToken)
    totalUsers.push(...result.users)
    nextPageToken = result.nextPageToken
  } while (nextPageToken !== undefined);

  return totalUsers
}

async function deleteUsersFromStorage<T extends typeof AuthService>(service: T, uids: string[]) {
  do {
    const partition = uids.splice(0, SINGLE_CALL_LIMIT)
    const result = await service.deleteUsers(partition)

    uids.push(...result)
  } while (uids.length > 0);

  return true
}

async function clearAuthStorage() {
  const userList = await getUsersFromStorage(AuthService)
  const uids = userList.map(user => user.uid)
  return await deleteUsersFromStorage(AuthService, uids)
}

async function initializeAuthStorage() {
  let totalUsers: UserImportRecord[] = []

  do {
    let count: number = USER_COUNT - totalUsers.length
    let result = await userSource.get(count)

    if (result.status === 'success') {
      const passedRecords = await addUsersToStorage(AuthService, result.data)

      totalUsers.push(...passedRecords)
      totalUsers = uniq(totalUsers, 'uid')
    }

  } while (totalUsers.length < USER_COUNT);

  return totalUsers
}

async function initialize() {
  await clearAuthStorage()
  const result = await initializeAuthStorage()

  console.log(result.length)
}

initialize()