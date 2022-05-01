
import AuthStorage from '@/storages/auth'
import AuthService from '@/services/Admin/Auth'
import { Logger, UserSource } from '@/utils/admin/classes'

const SEED = '114514'
const logger = new Logger()
const userSource = new UserSource(SEED, logger)
const authStorage = new AuthStorage(logger, AuthService)

async function initialize() {
  const result = await authStorage.initialize(userSource)

}

initialize()