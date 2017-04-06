/**
 * This decorator helps you to inject application state into a component's state
 * @example
 *
 * class Props {
 *   @data((state: AppState) => state.todos)
 *   todos: Todo[]
 * }
 *
 * interface Props { }
 *
 * @inject(Props)
 * export class TodoListComponent extends React.Component<Props, State> {
 *   ...
 * }
 *
 * @export
 * @param {*} props - Component properties class annotated with @data
 * @returns
 */
export declare function inject(propsClass: Function): (targetComponent: any) => any;
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
export declare function data(selector: {
    (state: any): any;
}, bindImmediate?: boolean): (target: any, propertyKey: string) => void;
