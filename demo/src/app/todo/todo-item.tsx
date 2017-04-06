import * as React from 'react'

import { RemoveTodoAction } from '../../action'
import { Todo } from '../../state'

interface Props {
  todo?: Todo
}

interface State {
  todo?: Todo
}

export class TodoItem extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      todo: this.props.todo
    }
  }

  onChange = (event) => {
    this.setState(state => ({
      todo: Object.assign({}, state.todo, {
        completed: event.target.checked
      })
    }))
  }

  removeItem = () => {
    new RemoveTodoAction(this.props.todo.id).dispatch()
  }

  handleChanges() {
    this.setState({
      todo: this.props.todo
    })
  }

  render() {
    const todo = this.state.todo || {}
    return (
      <li>
        <input className='toggle' checked={todo.completed} type='checkbox' onChange={this.onChange} />
        <label>{todo.text}</label>
        <button className='destroy' onClick={this.removeItem}></button>
      </li>
    )
  }
}