
import AuthStorage from '@/storages/auth'
import { Logger, UserSource } from '@/utils/admin/classes'
import AuthService from '@/services/Admin/Auth'

const SEED = '114514'
const logger = new Logger()
const userSource = new UserSource(SEED, logger)
const authStorage = new AuthStorage(logger)

async function initialize() {
  const result = await authStorage.initialize(userSource, AuthService)

}

initialize()