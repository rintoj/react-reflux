
# react-reflux

**React reflux** is a predictable state container for React apps just like REDUX. It helps you implement a unidirectional data flow (Flux architecture) in an easy and elegant way without much boilerplate code. The main objective of this module is to provide an implementation that has minimal touch points, while providing all the benefits of Redux. This is inspired by [refluxjs](https://github.com/reflux/refluxjs), [redux](http://redux.js.org/) & [angular-reflux](https://github.com/rintoj/angular-reflux) and uses TypeScript decorators.

Please note: This module is specially written for React applications. Methods and APIs defer from framework to framework. If you indent to use this module for angular check [angular-reflux](https://github.com/rintoj/angular-reflux)

## About

Flux is an architecture for unidirectional data flow. By forcing the data to flow in a single direction, Flux makes it easy to reason *how data-changes will affect the application* depending on what actions have been issued. The components themselves may only update  application-wide data by executing an action to avoid double maintenance nightmares.

## Install

```
npm install react-reflux --save
```

## 5 Simple Steps

### 1. Define State
To get the best out of TypeScript, declare interfaces that defines the structure of the application-state.

```ts
export interface Todo {
  id?: string;
  text?: string;
  completed?: boolean;
}

export interface AppState {
  todos?: Todo[];
  selectedTodo?: Todo;
}
```

### 2. Define Action
Define actions as classes with the necessary arguments passed on to the constructor. This way we will benefit from the type checking; never again we will miss-spell an action, miss a required parameter or pass a wrong parameter. Remember to extend the action from `Action` class. This makes your action listenable and dispatch-able.

```ts
import { Action } from 'react-reflux';

export class AddTodoAction extends Action {
  constructor(public todo: Todo) { super(); }
}
```

### 3. Create Store & Bind Action
Use `@action` decorator to bind a reducer function with an Action. The second parameter to the reducer function (`addTodo`) is an action (of type `AddTodoAction`); `@action` uses this information to bind the correct action. Also remember to decorate this class with `@store`.

```ts
import { AppState } from '../state';
import { AddTodoAction } from '../action';
import { action, store } from 'react-reflux';

@store
export class TodoStore {

  @action
  addTodo(state: AppState, action: AddTodoAction): AppState {
    return { todos: state.todos.concat([action.todo]) }
  }
}
```

Did you notice `@store`? Well, stores must bind each action with the reducer function at the startup and also must have a singleton instance. Both of these are taken care by `@store` decorator. Read [Organizing Stores](#organizing-stores) to understand more.

### 4. Dispatch Action

No singleton dispatcher! Instead this module lets every action act as dispatcher by itself. One less dependency to define, inject and maintain.

```ts
new AddTodoAction({
  id: 'sd2wde',
  text: 'Sample task'
}).dispatch();
```

### 5. Consume Data

Use `@data` decorator and a selector function (parameter to the decorator) to get updates from application state. The property gets updated only when the value returned by the selector function, changes from previous state to the current state. Additionally, just like a map function, you could map the data to another value as you choose.

We may at times need to derive additional properties from the data, sometimes using complex calculations. Therefore `@BindData` can be used with functions as well.

```ts
import * as React from 'react'
import { data, inject } from 'react-reflux'

class Props {
  @data((state: AppState) => state.todos)
  todos: Todo[]

  @data((state: AppState) => state.todos && state.todos.length > 0)
  hasTodos: boolean
}

interface State { }

@inject(Props)
export class TodoListComponent extends React.Component<Props, State> {

  render() {
    const todos = this.props.todos.map(
      todo => <li key={todo.id}>{todo.text}</li>
    )

    return <div>
      { this.props.hasTodos && <ul> {todos} </ul> }
    </div>
  }
}
```

## Reducer Functions & Async Tasks

Reducer functions can return either of the following

1. A portion of the application state as plain object
```ts
@action
add(state: AppState, action: AddTodoAction): AppState {
  return {
    todos: (state.todos || []).concat(action.todo)
  }
}
```

2. A portion of the application state wrapped in Promise, if it needs to perform an async task.
```ts
@action
add(state: AppState, action: AddTodoAction): Promise<AppStore> {
  return new Promise((resolve, reject) => {
    asyncTask().then(() => {
      resolve({
        todos: (state.todos || []).concat(action.todo)
      })
    })
  })
}
```

3. A portion of the application state wrapped in Observables, if the application state needs update multiple times over a period of time, all when handling an action. For example, you have to show loader before starting the process, and hide loader after you have done processing, you may use this.
```ts
@action
add(state: AppState, action: AddTodoAction): Observable<AppState> {
  return Observable.create((observer: Observer<AppState>) => {
    observer.next({ showLoader: true })
    asyncTask().then(() => {
      observer.next({
        todos: (state.todos || []).concat(action.todo),
        showLoader: false
      })
      observer.complete()
    })
  })
}
```

## Immutable Application State
To take advantage of React's change detection strategy we need to ensure that the state is indeed immutable. This module uses [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) for immutability.

Since application state is immutable, the reducer functions will not be able to update state directly; any attempt to update the state will result in error. Therefore a reducer function should either return a portion of the state that needs change (recommended) or a new application state wrapped in `ReplaceableState`, instead.

```ts
@store
export class TodoStore {

  @action
  selectTodo(state: AppState, action: SelectTodoAction): AppState {
    return {
      selectedTodo: action.todo
    }
  }

  @action
  resetTodos(state: AppState, action: ResetTodosAction): AppState {
    return new ReplaceableState({
      todos: [],
      selectedTodo: undefined
    })
  }
}
```

## Organizing Stores

All stores must be decorated with `@store` and must be imported into application.

1. Create `index.ts` in `stores` folder and import all stores
```ts
import './todo-store'
```

2. Import stores into application (`app.tsx`)
```ts
import './stores'

...
export class AppComponent extends React.Component<{}, {}> {
  ...
}
```

## Sample Code

Sample code is right [here](https://github.com/rintoj/react-reflux-starter). You can clone this repository to get started with react project integrated with this module.

```sh
git clone https://github.com/rintoj/react-reflux-starter
```

### Hope this module is helpful to you. Please make sure to checkout my other [projects](https://github.com/rintoj) and [articles](https://medium.com/@rintoj). Enjoy coding!

## Contributing
Contributions are very welcome! Just send a pull request. Feel free to contact [me](mailto:rintoj@gmail.com) or checkout my [GitHub](https://github.com/rintoj) page.

## Author

**Rinto Jose** (rintoj)

Follow me:
  [GitHub](https://github.com/rintoj)
| [Facebook](https://www.facebook.com/rinto.jose)
| [Twitter](https://twitter.com/rintoj)
| [Google+](https://plus.google.com/+RintoJoseMankudy)
| [Youtube](https://youtube.com/+RintoJoseMankudy)

## Versions
[Check CHANGELOG](https://github.com/rintoj/angular-reflux/blob/master/CHANGELOG.md)

## License
```
The MIT License (MIT)

Copyright (c) 2017 Rinto Jose (rintoj)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
