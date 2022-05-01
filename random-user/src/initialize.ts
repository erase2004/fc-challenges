
import AuthStorage from '@/storages/auth'
import AuthService from '@/services/admin/auth'
import Store from '@/storages/firestore'
import StoreService from '@/services/admin/firestore'
import { Logger, UserSource } from '@/utils/admin/classes'

const SEED = '114514'
const logger = new Logger()

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

  const userStorage = new Store('users', logger, StoreService)
  await userStorage.initialize(mapUsers, 'uid')

  const favoriteStorage = new Store('favorite', logger, StoreService)
  await favoriteStorage.initialize([], '')

  logger.print('END', 'Initialize Task Finished')
}

initialize()