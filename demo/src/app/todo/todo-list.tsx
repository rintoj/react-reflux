import * as React from 'react'

import { AppState, Todo } from '../../state'
import { data, observer } from 'react-reflux'

import { TodoItem } from './todo-item'

class Props {
  @data((state: AppState) => state.todos)
  filteredTodos?: Todo[]
}

interface State { }

@observer(Props)
export class TodoList extends React.Component<Props, State> {
  render() {
    const { filteredTodos } = this.props
    return (
      <ul id='todo-list'>
        {(filteredTodos || []).map(
          todo => <TodoItem key={todo.id} todo={todo}></TodoItem>
        )}
      </ul>
    )
  }
}