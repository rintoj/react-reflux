"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./observable");
var Immutable = require("seamless-immutable");
var Observable_1 = require("rxjs/Observable");
var constance_1 = require("./constance");
var replaceable_state_1 = require("./replaceable-state");
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
var Action = (function () {
    function Action() {
    }
    Object.defineProperty(Action, "lastAction", {
        /**
         * The last action occurred
         *
         * @readonly
         * @static
         *
         * @memberOf Action
         */
        get: function () {
            return constance_1.Reflux.lastAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "identity", {
        /**
         * Returns identity of this class
         *
         * @readonly
         * @type {string}
         */
        get: function () {
            var id = constance_1.Reflux.actionIdentities.indexOf(this.constructor);
            if (id < 0) {
                constance_1.Reflux.actionIdentities.push(this.constructor);
                id = constance_1.Reflux.actionIdentities.indexOf(this.constructor);
            }
            return "c" + id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribe to this action. actionObserver will be called when 'dispatch()' is invoked
     *
     * @param {ActionObserver} actionObserver The function that process the action
     * @param {*} context Context binding
     * @returns {Action}
     */
    Action.prototype.subscribe = function (actionObserver, context) {
        if (!constance_1.Reflux.subscriptions[this.identity]) {
            constance_1.Reflux.subscriptions[this.identity] = [];
        }
        var callback = context ? actionObserver.bind(context) : actionObserver;
        constance_1.Reflux.subscriptions[this.identity].push(callback);
        return this;
    };
    /**
     * Dispatch this action. Returns an observable which will be completed when all action subscribers
     * complete it's processing
     *
     * @returns {Promise<S>}
     */
    Action.prototype.dispatch = function () {
        var _this = this;
        constance_1.Reflux.lastAction = this;
        var subscriptions = constance_1.Reflux.subscriptions[this.identity];
        if (subscriptions == undefined || subscriptions.length === 0) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var observable = Observable_1.Observable.from(subscriptions)
                .flatMap(function (actionObserver) {
                var result = actionObserver(constance_1.Reflux.state, _this);
                if (!(result instanceof Observable_1.Observable || result instanceof Promise)) {
                    return Observable_1.Observable.create(function (observer) {
                        observer.next(result);
                        observer.complete();
                    });
                }
                return result;
            })
                .map(function (state) {
                if (state instanceof replaceable_state_1.ReplaceableState) {
                    // replace the state with the new one if not 'undefined'
                    var nextState = state.state;
                    if (nextState == undefined)
                        return;
                    if (!(nextState instanceof Immutable))
                        nextState = Immutable.from(nextState);
                    constance_1.Reflux.state = nextState;
                    return nextState;
                }
                else if (state != undefined) {
                    // merge the state with existing state
                    constance_1.Reflux.state = constance_1.Reflux.state.merge(state, { deep: true });
                }
                return state;
            })
                .skipWhile(function (_, i) { return i + 1 < subscriptions.length; })
                .catch(function (error) {
                reject(error);
                return Observable_1.Observable.empty();
            })
                .map(function (state) {
                if (state != undefined) {
                    constance_1.Reflux.stateStream.next(constance_1.Reflux.state);
                }
                return state;
            })
                .share();
            observable.subscribe(undefined, reject, resolve);
        });
    };
    return Action;
}());
exports.Action = Action;
//# sourceMappingURL=action.js.map