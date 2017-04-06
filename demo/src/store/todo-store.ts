import { AddTodoAction, RemoveCompletedTodosAction, RemoveTodoAction, SetFilterAction, ToggleAllTodosAction, ToggleTodoAction } from '../action'
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
  toggleTodo(state: AppState, action: ToggleTodoAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: (state.todos || []).map(
          todo => {
            if (todo.id === action.id) {
              return Object.assign({}, todo, {
                completed: action.completed
              })
            }
            return todo
          }
        )
      })
      observer.complete()
    })
  }

  @observe
  remove(state: AppState, action: RemoveTodoAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: (state.todos || []).filter(todo => todo.id !== action.id)
      })
      observer.complete()
    }).share()
  }

  @observe
  removeCompleted(state: AppState, action: RemoveCompletedTodosAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({
        todos: (state.todos || []).filter(todo => !todo.completed)
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

  @observe
  setFilter(state: AppState, action: SetFilterAction): any {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ filter: action.filter })
      observer.complete()
    }).share()
  }

  private generateId() {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}