import { Todo } from './todo'

export interface AppState {
  todos?: Todo[]
  filter?: string
}