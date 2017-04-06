"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var constance_1 = require("./constance");
var constance_2 = require("./constance");
/**
 * Bind data for give key and target using a selector function
 *
 * @param {any} target
 * @param {any} key
 * @param {any} selectorFunc
 */
function bindData(target, key, selector) {
    return constance_2.Reflux.stateStream
        .select(selector)
        .subscribe(function (data) {
        if (typeof target.setState === 'function') {
            var state = {};
            state[key] = data;
            target.setState(state);
        }
        if (typeof target[key] === 'function')
            return target[key].call(target, data);
        target[key] = data;
    });
}
/**
 * Observer is a decorator that will help observe an action
 *
 * @export
 * @param {*} target
 * @returns
 */
function observer(target) {
    return function (targetComponent) {
        return (function (_super) {
            __extends(ObserverComponent, _super);
            function ObserverComponent(props) {
                return _super.call(this, props) || this;
            }
            ObserverComponent.prototype.componentDidMount = function () {
                var _this = this;
                var dataBindings = Reflect.getMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, target);
                if (dataBindings != undefined && dataBindings.destroyed === true) {
                    dataBindings.subscriptions = dataBindings.subscriptions.concat(Object.keys(dataBindings.selectors)
                        .map(function (key) { return bindData(_this, key, dataBindings.selectors[key]); }));
                    dataBindings.destroyed = false;
                    Reflect.defineMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, dataBindings, this);
                }
            };
            ObserverComponent.prototype.componentWillUnmount = function () {
                var dataBindings = Reflect.getMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, this);
                if (dataBindings != undefined) {
                    dataBindings.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
                    dataBindings.subscriptions = [];
                    dataBindings.destroyed = true;
                    Reflect.defineMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, dataBindings, this);
                }
            };
            ObserverComponent.prototype.render = function () {
                return React.createElement(targetComponent, __assign({}, this.props, this.state));
            };
            return ObserverComponent;
        }(React.Component));
    };
}
exports.observer = observer;
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
function data(selector, bindImmediate) {
    return function (target, propertyKey) {
        var bindingsMeta = Reflect.getMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, target.constructor);
        if (!Reflect.hasMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, target.constructor)) {
            bindingsMeta = { selectors: {}, subscriptions: [], destroyed: !bindImmediate };
        }
        bindingsMeta.selectors[propertyKey] = selector;
        if (bindImmediate) {
            bindingsMeta.subscriptions.push(bindData(target, propertyKey, selector));
        }
        Reflect.defineMetadata(constance_1.REFLUX_DATA_BINDINGS_KEY, bindingsMeta, target.constructor);
    };
}
exports.data = data;
//# sourceMappingURL=bind-data.js.map