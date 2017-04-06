import { AddTodoAction, ToggleAllTodosAction } from '../action'
import { Store, observe } from 'react-reflux'

import { AppState } from '../state'
import { Observable } from 'rxjs/Rx'
import { Observer } from 'rxjs/Rx'

export class TodoStore extends Store {

  @observe
  add(state: AppState, action: AddTodoAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: (state.todos || []).concat(
          Object.assign({ id: this.generateId() }, action.todo)
        )
      })
      observer.complete()
    }).share()
  }

  @observe
  toggleAll(state: AppState, action: ToggleAllTodosAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
      observer.complete()
    }).share()
  }

  private generateId() {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}