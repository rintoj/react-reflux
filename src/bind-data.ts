import * as React from 'react'

import { REFLUX_DATA_BINDINGS_KEY } from './constance'
import { Reflux } from './constance'
import { Subscription } from 'rxjs/Subscription'

declare var Reflect: any

/**
 * Bind data for give key and target using a selector function
 *
 * @param {any} target
 * @param {any} key
 * @param {any} selectorFunc
 */
function bindData(target: any, key: string, selector: { (state: any): any }): Subscription {
  return Reflux.stateStream
    .select(selector)
    .subscribe(data => {
      if (typeof target.setState === 'function') {
        let state = {}
        state[key] = data
        target.setState(state)
      }
      if (typeof target[key] === 'function') return target[key].call(target, data)
      target[key] = data
    })
}

/**
 * Observer is a decorator that will help observe an action
 *
 * @export
 * @param {*} target
 * @returns
 */
export function observer(target: any) {

  return (targetComponent: any): any => {

    return class ObserverComponent extends React.Component<any, any> {
      constructor(props) {
        super(props)
      }

      componentDidMount() {
        let dataBindings = Reflect.getMetadata(REFLUX_DATA_BINDINGS_KEY, target)
        if (dataBindings != undefined && dataBindings.destroyed === true) {

          dataBindings.subscriptions = dataBindings.subscriptions.concat(
            Object.keys(dataBindings.selectors)
              .map(key => bindData(this, key, dataBindings.selectors[key]))
          )

          dataBindings.destroyed = false
          Reflect.defineMetadata(REFLUX_DATA_BINDINGS_KEY, dataBindings, this)
        }
      }

      componentWillUnmount() {
        let dataBindings = Reflect.getMetadata(REFLUX_DATA_BINDINGS_KEY, this)
        if (dataBindings != undefined) {
          dataBindings.subscriptions.forEach(subscription => subscription.unsubscribe())
          dataBindings.subscriptions = []
          dataBindings.destroyed = true
          Reflect.defineMetadata(REFLUX_DATA_BINDINGS_KEY, dataBindings, this)
        }
      }

      render() {
        return React.createElement(targetComponent, { ...this.props, ...this.state })
      }
    }
  }
}

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
export function data(selector: { (state: any): any }, bindImmediate?: boolean) {
  return (target: any, propertyKey: string) => {

    let bindingsMeta = Reflect.getMetadata(REFLUX_DATA_BINDINGS_KEY, target.constructor)
    if (!Reflect.hasMetadata(REFLUX_DATA_BINDINGS_KEY, target.constructor)) {
      bindingsMeta = { selectors: {}, subscriptions: [], destroyed: !bindImmediate }
    }

    bindingsMeta.selectors[propertyKey] = selector
    if (bindImmediate) {
      bindingsMeta.subscriptions.push(bindData(target, propertyKey, selector))
    }
    Reflect.defineMetadata(REFLUX_DATA_BINDINGS_KEY, bindingsMeta, target.constructor)
  }
}