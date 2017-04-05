// import stores
import { TodoStore } from './todo-store'

// define stores
const stores = [
  TodoStore
]

// create stores
stores.forEach(_Store => new _Store())