import { AddTodoAction, RemoveCompletedTodosAction, RemoveTodoAction, SetFilterAction, ToggleAllTodosAction, ToggleTodoAction } from '../action'
import { Store, action } from 'react-reflux'

import { AppState } from '../state'
import { Observable } from 'rxjs/Rx'
import { Observer } from 'rxjs/Rx'

export class TodoStore extends Store {

  @action
  add(state: AppState, action: AddTodoAction) {
    return {
      todos: (state.todos || []).concat(
        Object.assign({ id: this.generateId() }, action.todo)
      )
    }
  }

  @action
  toggleTodo(state: AppState, action: ToggleTodoAction) {
    return {
      todos: (state.todos || []).map(todo =>
        (todo.id === action.id) ? Object.assign({}, todo, {
          completed: action.completed
        }) : todo
      )
    }
  }

  @action
  remove(state: AppState, action: RemoveTodoAction) {
    return {
      todos: (state.todos || []).filter(todo => todo.id !== action.id)
    }
  }

  @action
  removeCompleted(state: AppState, action: RemoveCompletedTodosAction) {
    return {
      todos: (state.todos || []).filter(todo => !todo.completed)
    }
  }

  @action
  toggleAll(state: AppState, action: ToggleAllTodosAction) {
    return new Promise((resolve, reject) => {
      resolve({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
    })
  }

  @action
  setFilter(state: AppState, action: SetFilterAction) {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ filter: action.filter })
      observer.complete()
    }).share()
  }

  private generateId() {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}