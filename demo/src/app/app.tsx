import '../store'

import * as React from 'react'

import { TodoFooter, TodoHeader, TodoList } from './todo'

export class App extends React.Component<{}, {}> {

  render() {
    return <div id='"todoapp"'>
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  }
}
