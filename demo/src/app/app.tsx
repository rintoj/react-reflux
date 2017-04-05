import './app.css'
import '../asset/splash.png'
import '../store'

import * as React from 'react'

import { AddTodo, RemoveLastTodo } from '../action'
import { AppState, Todo } from '../state'
import { data, observer } from '../reflux'

class Props {
  @data((state: AppState) => state.todos)
  todos?: Todo[]
}

interface State { }

@observer(Props)
export class App extends React.Component<Props, State> {

  start() {
    new AddTodo({ text: 'text' }).dispatch()
  }

  stop() {
    new RemoveLastTodo().dispatch()
  }

  render() {
    return (
      <div className='app'>
        <div className='app-header'>
          <img src={require('../asset/logo.svg')} className='app-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <p className='app-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => this.start()}>START</button>
        <button onClick={() => this.stop()}>STOP</button>
        <ul className='todos'>
          {(this.props.todos || []).map(todo => <li key={todo.id}>{todo.text}</li>)}
        </ul>
      </div>
    )
  }
}
