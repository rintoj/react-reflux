import { Action } from './action';
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
export declare function action(target: any, propertyKey: string, descriptor: PropertyDescriptor): {
    value: (state: any, action: Action) => any;
};
