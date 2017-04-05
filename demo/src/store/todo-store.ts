import { Store, observe } from '../reflux'

import { AddTodo } from '../action'
import { AppState } from '../state'
import { Observable } from 'rxjs/Rx'
import { Observer } from 'rxjs/Rx'
import { RemoveLastTodo } from './../action/todo-action'

export class TodoStore extends Store {

  @observe
  add(state: AppState, action: AddTodo): Observable<any> {
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
  removeLast(state: AppState, action: RemoveLastTodo): Observable<any> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: action && state.todos.slice(0, -1)
      })
      observer.complete()
    }).share()
  }

  generateId() {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}