import { db, auth } from '@/utils/admin/firebase'
import { UserImportRecord, UserImportOptions, UserRecord } from 'firebase-admin/auth'

type UserImportRecordExtended = UserImportRecord & {
  shouldRemove?: boolean | undefined;
}

export default {
  async addUsers(record: UserImportRecordExtended[] , options: UserImportOptions) {
    // add users and return success records
    const result = await auth.importUsers(record, options)

    if (result.errors.length > 0) {
      const indexOfErrors = result.errors.map((indexedErrors) => indexedErrors.index)
      indexOfErrors.forEach((index) => { record[index]['shouldRemove'] = true })
      const successRecords = record.filter((r) => r.shouldRemove !== true)

      return successRecords
    } else {

      return record
    }
  },
  async deleteUsers(uids: string[]) {
    // remove users by uid and return failed records
    const result = await auth.deleteUsers(uids)
    const failedUIDs: string[] = []

    if (result.errors.length > 0) {
      result.errors.forEach((indexedErrors) => failedUIDs.push(uids[indexedErrors.index]))
    }

    return failedUIDs
  },
  async listUsers(limit: number, nextPageToken?: string | undefined) {
    // return user list with pagination and nexPageToken if more users exists
    const result = await auth.listUsers(limit, nextPageToken)
    const users = result.users.map((userRecord) => userRecord)

    return {
      users,
      nextPageToken: result.pageToken
    }
  }
}

