"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constance_1 = require("./constance");
/**
 * This decorator configure instance of a store
 *
 * @export
 * @param {*} storeClass
 * @returns
 */
function store(storeClass) {
    // save a reference to the original constructor
    var original = storeClass;
    // a utility function to generate instances of a class
    function construct(constructor, args) {
        var dynamicClass = function () {
            return constructor.apply(this, args);
        };
        dynamicClass.prototype = constructor.prototype;
        return new dynamicClass();
    }
    // the new constructor behavior
    var overriddenConstructor = function overriddenConstructor() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!Reflect.hasMetadata(constance_1.REFLUX_ACTION_KEY, this))
            return;
        var refluxActions = Reflect.getMetadata(constance_1.REFLUX_ACTION_KEY, this);
        Object.keys(refluxActions).forEach(function (name) { return new refluxActions[name]().subscribe(_this[name], _this); });
        return construct(original, args);
    };
    // copy prototype so instanceof operator still works
    overriddenConstructor.prototype = original.prototype;
    // create singleton instance
    var instance = new overriddenConstructor();
    // return new constructor (will override original)
    return instance && overriddenConstructor;
}
exports.store = store;
//# sourceMappingURL=store.js.map