import * as React from 'react'

interface Props {
  leftCount?: number
  completedCount?: number
  pendingCount?: number
  filter?: string
}
interface State { }

export class TodoFooter extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.clearCompleted = this.clearCompleted.bind(this)
  }

  clearCompleted() {
    // this.props.todoStore.clearCompleted()
  }

  setAllFilter = () => {
    // this.props.todoStore.setFilter('ALL')
  }

  setActiveFilter = () => {
    // this.props.todoStore.setFilter('ACTIVE')
  }

  setCompletedFilter = () => {
    // this.props.todoStore.setFilter('COMPLETED')
  }

  render() {
    const { leftCount, completedCount, filter } = this.props
    return (
      <footer id='footer'>
        <span id='todo-count'><strong>{leftCount} </strong>
          {leftCount > 1 ? 'items' : 'item'} left
            </span>
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