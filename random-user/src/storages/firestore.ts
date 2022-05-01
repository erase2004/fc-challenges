import type { Logger } from '@/utils/admin/classes'
import StoageService from '@/services/admin/firestore'

export default class Store {
  private BATCH_SIZE: number = 500
  private logger: Logger
  private service: typeof StoageService
  private name: string

  constructor(name: string, logger: Logger, service: typeof StoageService) {
    this.name = name
    this.logger = logger
    this.service = service
  }

  async addRecords<T extends object, U extends keyof T>(records: T[], recordKey: U) {
    return await this.service.addRecords(this.name, records, recordKey, this.BATCH_SIZE)
  }

  async delete() {
    return await this.service.deleteCollection(this.name, this.BATCH_SIZE)
  }

  async initialize<T extends object, U extends keyof T>(records: T[], recordKey: U) {
    let action = `${this.name} - Clear Storage`
    this.logger.print('BEGIN', action)
    await this.delete()
    this.logger.print('END', action)

    if (recordKey === '') {
      return
    }

    action = `${this.name} - Add Records to Storage`
    this.logger.print('BEGIN', action)
    await this.addRecords(records, recordKey)
    this.logger.print('END', action)
  }
}