import { StateSelector } from './state-selector';
/**
 * Observer is a decorator that will help observe an action
 *
 * @export
 * @param {*} target
 * @returns
 */
export declare function observer(target: any): (targetComponent: any) => any;
/**
 * Bind data to a variable or to a function
 *
 * @example
 * @BindData(state => state.todos)
 * todos: Todo[]
 *
 * @BindDAta(state => state.todos)
 * todosDidChange(todos: Todo[]) {
 *   // your logic
 * }
 *
 *
 * @export
 * @param {*} selector
 * @returns
 */
export declare function data(selector: StateSelector, bindImmediate?: boolean): (target: any, propertyKey: string) => void;
