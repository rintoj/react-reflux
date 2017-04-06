import { Action } from './action'
import { REFLUX_ACTION_KEY } from './constance'

declare var Reflect: any

/**
 * This decorator binds an action to the function
 *
 * @example
 *  @action
 *  addTodo(state: State, action: AddTodoAction): Observable<State> {
 *    return Observable.create((observer: Observer<State>) => {
 *       observer.next({
 *          todos: state.todos.concat([action.todo])
 *       })
 *       observer.complete()
 *    }).share()
 *  }
 *
 * @export
 * @template S
 * @returns
 */
export function action(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

  let metadata = Reflect.getMetadata('design:paramtypes', target, propertyKey)
  if (metadata.length < 2) throw new Error('BindAction: function must have two arguments!')

  let refluxActions = {}
  if (Reflect.hasMetadata(REFLUX_ACTION_KEY, target)) {
    refluxActions = Reflect.getMetadata(REFLUX_ACTION_KEY, target)
  }
  refluxActions[propertyKey] = metadata[1]
  Reflect.defineMetadata(REFLUX_ACTION_KEY, refluxActions, target)

  return {
    value: function bindAction(state: any, action: Action): any {
      return descriptor.value.call(this, state, action)
    }
  }
}