
import AuthStorage from '@/backend/storages/auth'
import Store from '@/backend/storages/firestore'
import { Logger, UserSource } from '@/backend/utils/classes'

const SEED = '114514'
const logger = new Logger()

async function initialize() {
  const userSource = new UserSource(SEED, logger)
  const authStorage = new AuthStorage(logger)

  const users = await authStorage.initialize(userSource)
  const mapUsers = users.map(user => ({
    uid: user.uid,
    email: user.email,
    avatar: user.avatar,
    gender: user.gender,
    age: user.age
  }))

  const userStorage = new Store('users', logger)
  const favoriteStorage = new Store('favorite', logger)

  await Promise.all([
    userStorage.initialize(mapUsers, 'uid'),
    favoriteStorage.initialize([], '')
  ])

  logger.print('END', 'Initialize Task Finished')
}

initialize()