import './observable'

import * as Immutable from 'seamless-immutable'

import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Reflux } from './constance'
import { ReplaceableState } from './replaceable-state'

/**
 * Observer for next value from observable (used by subscribe() function)
 *
 * @export
 * @interface ActionObserver
 */
export interface ActionObserver {
  (state: any, action: Action): Observable<any>
}

/**
 * Observer for an error from observable (used by subscribe() function)
 *
 * @export
 * @interface ErrorObserver
 */
export interface ErrorObserver {
  (error: any): void
}

/**
 * Defines an action which an be extended to implement custom actions for a reflux application
 *
 * @example
 *
 * // Create your own action class
 * class PageSwitchAction extends Action {
 *   constructor(public pageId: string) {
 *     super()
 *   }
 * }
 *
 * // Subscribe to your action
 * new PageSwitchAction(undefined).subscribe((state: State, action: PageSwitchAction): Observable<State> => {
 *   return Observable.create((observer: Observer<State>) => {
 *     observer.next(updatedState)
 *       observer.complete()
 *   }).share()
 * }, this)
 *
 * // Dispatch your action
 * new PageSwitchAction('page1').dispatch()
 *
 * @export
 * @class Action
 */
export class Action {

  /**
   * The last action occurred
   *
   * @readonly
   * @static
   *
   * @memberOf Action
   */
  public static get lastAction() {
    return Reflux.lastAction
  }

  /**
   * Returns identity of this class
   *
   * @readonly
   * @type {string}
   */
  get identity(): string {
    let id = Reflux.actionIdentities.indexOf(this.constructor)
    if (id < 0) {
      Reflux.actionIdentities.push(this.constructor)
      id = Reflux.actionIdentities.indexOf(this.constructor)
    }
    return `c${id}`
  }

  /**
   * Subscribe to this action. actionObserver will be called when 'dispatch()' is invoked
   *
   * @param {ActionObserver} actionObserver The function that process the action
   * @param {*} context Context binding
   * @returns {Action}
   */
  public subscribe(actionObserver: ActionObserver, context: any): Action {
    if (!Reflux.subscriptions[this.identity]) {
      Reflux.subscriptions[this.identity] = []
    }
    const callback = context ? actionObserver.bind(context) : actionObserver
    Reflux.subscriptions[this.identity].push(callback)
    return this
  }

  /**
   * Dispatch this action. Returns an observable which will be completed when all action subscribers
   * complete it's processing
   *
   * @returns {Observable<S>}
   */
  dispatch(): Observable<any> {

    Reflux.lastAction = this
    let subscriptions: ActionObserver[] = Reflux.subscriptions[this.identity]
    if (subscriptions == undefined || subscriptions.length === 0) {
      return Observable.empty()
    }

    let observable: Observable<any> = Observable.from(subscriptions)

      // convert 'Observable' returned by action subscribers to state
      .flatMap((actionObserver: ActionObserver): Observable<any> => {
        const result = actionObserver(Reflux.state, this)
        if (!(result instanceof Observable || result instanceof Promise)) {
          return Observable.create((observer: Observer<any>) => {
            observer.next(result)
            observer.complete()
          })
        }
        return result
      })

      // merge or replace state
      .map((state: any) => {
        if (state instanceof ReplaceableState) {
          // replace the state with the new one if not 'undefined'
          let nextState = (state as ReplaceableState).state
          if (nextState == undefined) return
          if (!(nextState instanceof Immutable)) nextState = Immutable.from(nextState)
          Reflux.state = nextState
          return nextState

        } else if (state != undefined) {
          // merge the state with existing state
          Reflux.state = Reflux.state.merge(state, { deep: true })
        }
        return state
      })

      // wait until all the subscripts have completed processing
      .skipWhile((_, i: number) => i + 1 < subscriptions.length)

      // push 'next' state to 'stateStream' if there has been a change to the state
      .map((state: any) => {
        if (state != undefined) {
          Reflux.stateStream.next(Reflux.state)
        }
        return state
      })

      // make this sharable (to avoid multiple copies of this observable being created)
      .share()

    observable.subscribe()
    return observable
  }
}
