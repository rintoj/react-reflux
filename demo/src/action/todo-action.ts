import { Action } from '../reflux'
import { Todo } from '../state'

export class AddTodo extends Action {
  constructor(public todo: Todo) { super() }
}

export class RemoveLastTodo extends Action {
  constructor() { super() }
}