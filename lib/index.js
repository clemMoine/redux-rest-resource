'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpError = exports.fetch = exports.mergeReducers = exports.combineReducers = exports.reduceReducers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = require('./defaults');

Object.keys(_defaults).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _defaults[key];
    }
  });
});

var _helpers = require('./reducers/helpers');

Object.defineProperty(exports, 'reduceReducers', {
  enumerable: true,
  get: function get() {
    return _helpers.reduceReducers;
  }
});
Object.defineProperty(exports, 'combineReducers', {
  enumerable: true,
  get: function get() {
    return _helpers.combineReducers;
  }
});
Object.defineProperty(exports, 'mergeReducers', {
  enumerable: true,
  get: function get() {
    return _helpers.mergeReducers;
  }
});
exports.createResource = createResource;
exports.createResourceAction = createResourceAction;

var _actions2 = require('./actions');

var _reducers2 = require('./reducers');

var _types = require('./types');

var _fetch = require('./helpers/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _util = require('./helpers/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js
// var User = $resource('/user/:userId', {userId:'@id'});

exports.fetch = _fetch2.default;
exports.HttpError = _fetch.HttpError;
function createResource(_ref) {
  var resourceName = _ref.name,
      resourcePluralName = _ref.pluralName,
      _ref$actions = _ref.actions,
      givenActions = _ref$actions === undefined ? {} : _ref$actions,
      _ref$mergeDefaultActi = _ref.mergeDefaultActions,
      mergeDefaultActions = _ref$mergeDefaultActi === undefined ? true : _ref$mergeDefaultActi,
      _ref$pick = _ref.pick,
      pickedActions = _ref$pick === undefined ? [] : _ref$pick,
      args = _objectWithoutProperties(_ref, ['name', 'pluralName', 'actions', 'mergeDefaultActions', 'pick']);

  // Merge passed actions with common defaults
  var resolvedActions = mergeDefaultActions ? (0, _util.mergeObjects)({}, _defaults.defaultActions, givenActions) : givenActions;
  // Eventually pick selected actions
  if (pickedActions.length) {
    resolvedActions = _util.pick.apply(undefined, [resolvedActions].concat(_toConsumableArray(pickedActions)));
  }
  var types = (0, _types.createTypes)(resolvedActions, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, args));
  var actions = (0, _actions2.createActions)(resolvedActions, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, args));
  var reducers = (0, _reducers2.createReducers)(resolvedActions, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, args));
  var rootReducer = (0, _reducers2.createRootReducer)(reducers, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, args));
  return {
    actions: actions,
    reducers: rootReducer, // breaking change
    rootReducer: rootReducer,
    types: types
  };
}

function createResourceAction(_ref2) {
  var resourceName = _ref2.name,
      resourcePluralName = _ref2.pluralName,
      _ref2$method = _ref2.method,
      method = _ref2$method === undefined ? 'GET' : _ref2$method,
      args = _objectWithoutProperties(_ref2, ['name', 'pluralName', 'method']);

  var actionId = method.toLowerCase();
  var scope = (0, _types.getTypesScope)(resourceName);
  var types = (0, _types.scopeTypes)((0, _types.createType)(actionId, { resourceName: resourceName, resourcePluralName: resourcePluralName }), scope);
  var actionName = (0, _actions2.getActionName)(actionId, { resourceName: resourceName, resourcePluralName: resourcePluralName });
  var actions = _defineProperty({}, actionName, (0, _actions2.createAction)(actionId, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName, scope: scope }, args)));
  var reducers = _defineProperty({}, actionId, (0, _reducers2.createReducer)(actionId, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName, scope: scope }, args)));
  var rootReducer = (0, _reducers2.createRootReducer)(reducers, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, args));
  return {
    actions: actions,
    reducers: reducers, // new API
    rootReducer: rootReducer,
    types: types
  };
}
//# sourceMappingURL=index.js.map