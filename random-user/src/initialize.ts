
import AuthStorage from '@/storages/auth'
import AuthService from '@/services/admin/auth'
import { Logger, UserSource } from '@/utils/admin/classes'

const SEED = '114514'
const logger = new Logger()
const userSource = new UserSource(SEED, logger)
const authStorage = new AuthStorage(logger, AuthService)

async function initialize() {
  const userSource = new UserSource(SEED, logger)
  const authStorage = new AuthStorage(logger, AuthService)

  const users = await authStorage.initialize(userSource)
  const mapUsers = users.map(user => ({
    uid: user.uid,
    email: user.email,
    avatar: user.avatar,
    gender: user.gender,
    age: user.age
  }))
}

initialize()