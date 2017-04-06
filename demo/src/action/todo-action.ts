import { Action } from 'react-reflux'
import { Todo } from '../state'

export class AddTodoAction extends Action {
  constructor(public todo: Todo) { super() }
}

export class RemoveTodoAction extends Action {
  constructor(public id: string) { super() }
}

export class ToggleTodoAction extends Action {
  constructor(public id: string) { super() }
}

export class ToggleAllTodosAction extends Action {
  constructor(public completed: boolean) { super() }
}
