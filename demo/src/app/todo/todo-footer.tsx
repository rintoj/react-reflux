import * as React from 'react'

import { RemoveCompletedTodosAction, SetFilterAction } from '../../action'
import { data, observer } from 'react-reflux'

import { AppState } from '../../state'

class Props {
  @data((state: AppState) =>
    (state.todos || []).reduce((count, item) => count - (item.completed ? 1 : 0), state.todos.length)
  )
  leftCount?: number

  @data((state: AppState) =>
    (state.todos || []).reduce((count, item) => count + (item.completed ? 1 : 0), 0)
  )
  completedCount?: number

  @data((state: AppState) =>
    (state.todos || []).reduce((count, item) => count + (item.completed ? 0 : 1), 0)
  )
  pendingCount?: number

  @data((state: AppState) => state.filter)
  filter?: string
}
interface State { }

@observer(Props)
export class TodoFooter extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.clearCompleted = this.clearCompleted.bind(this)
  }

  clearCompleted() {
    new RemoveCompletedTodosAction().dispatch()
  }

  setAllFilter = () => {
    new SetFilterAction('ALL').dispatch()
  }

  setActiveFilter = () => {
    new SetFilterAction('ACTIVE').dispatch()
  }

  setCompletedFilter = () => {
    new SetFilterAction('COMPLETED').dispatch()
  }

  render() {
    const { leftCount, completedCount, filter } = this.props
    return (
      <footer id='footer'>
        {leftCount != undefined &&
          <span id='todo-count'><strong>{leftCount} </strong>
            {leftCount > 1 ? 'items' : 'item'} left
          </span>
        }
        <ul id='filters'>
          <li>
            <a href='#' className={filter === 'ALL' ? 'selected' : undefined}
              onClick={this.setAllFilter}>All</a>
          </li>
          <li>
            <a href='#' className={filter === 'ACTIVE' ? 'selected' : undefined}
              onClick={this.setActiveFilter}>Active</a>
          </li>
          <li>
            <a href='#' className={filter === 'COMPLETED' ? 'selected' : undefined}
              onClick={this.setCompletedFilter}>Completed</a>
          </li>
        </ul>
        {completedCount > 0 &&
          <button id='clear-completed' onClick={this.clearCompleted}>Clear completed</button>
        }
      </footer>
    )
  }
}