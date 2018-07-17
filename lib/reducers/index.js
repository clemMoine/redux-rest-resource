'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRootReducer = exports.createReducers = exports.createReducer = exports.defaultReducers = exports.initialState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = require('./../defaults');

var _types = require('./../types');

var _util = require('./../helpers/util');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getUpdateArrayData = function getUpdateArrayData(action, itemId) {
  var actionOpts = action.options || {};
  var idKey = (0, _util.getIdKey)(action, { multi: false });

  return actionOpts.assignResponse ? (0, _util.find)(action.body, _defineProperty({}, idKey, itemId)) : Object.keys(action.context).reduce(function (soFar, key) {
    if (key !== 'ids') {
      soFar[key] = action.context[key];
    }
    return soFar;
  }, {});
};

var defaultReducers = {
  create: function create(state, action) {
    switch (action.status) {
      case 'pending':
        // Add object to store as soon as possible?
        return _extends({}, state, {
          isCreating: true
          // items: [{
          //   id: state.items.reduce((maxId, obj) => Math.max(obj.id, maxId), -1) + 1,
          //   ...action.context
          // }, ...state.items]
        });
      case 'resolved':
        // Assign returned object
        return _extends({}, state, {
          isCreating: false,
          items: [].concat(_toConsumableArray(state.items || []), [action.body])
        });
      case 'rejected':
        return _extends({}, state, {
          isCreating: false
        });
      default:
        return state;
    }
  },
  fetch: function fetch(state, action) {
    switch (action.status) {
      case 'pending':
        return _extends({}, state, {
          isFetching: true,
          didInvalidate: false
        });
      case 'resolved':
        {
          var isPartialContent = action.code === 206;
          var items = [];
          if (isPartialContent && action.contentRange) {
            var contentRange = action.contentRange;

            if (contentRange.first > 0) {
              items = items.concat(state.items.slice(0, contentRange.last));
            }
            for (var i = contentRange.first; i <= contentRange.last; i += 1) {
              var newItem = action.body[i - contentRange.first];
              if (newItem != null) {
                items.push(newItem);
              }
            }
          } else {
            items = items.concat(action.body);
          }

          return _extends({}, state, {
            isFetching: false,
            didInvalidate: false,
            items: items,
            lastUpdated: action.receivedAt
          });
        }
      case 'rejected':
        return _extends({}, state, {
          isFetching: false,
          didInvalidate: false
        });
      default:
        return state;
    }
  },
  get: function get(state, action) {
    switch (action.status) {
      case 'pending':
        return _extends({}, state, {
          isFetchingItem: true,
          didInvalidateItem: false
        });
      case 'resolved':
        {
          var actionOpts = action.options || {};
          var idKey = (0, _util.getIdKey)(action, { multi: false });
          var item = action.body;
          var update = {};
          if (actionOpts.assignResponse) {
            var updatedItems = state.items;
            var listItemIndex = updatedItems.findIndex(function (el) {
              return el[idKey] === item[idKey];
            });
            if (listItemIndex !== -1) {
              updatedItems.splice(listItemIndex, 1, item);
              update.items = updatedItems.slice();
            }
          }
          return _extends({}, state, {
            isFetchingItem: false,
            didInvalidateItem: false,
            lastUpdatedItem: action.receivedAt,
            item: item
          }, update);
        }
      case 'rejected':
        return _extends({}, state, {
          isFetchingItem: false,
          didInvalidateItem: false
        });
      default:
        return state;
    }
  },
  update: function update(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isUpdating: true
        });
      case 'resolved':
        {
          // Assign context or returned object
          var idKey = (0, _util.getIdKey)(action, { multi: false });
          var id = (0, _util.isObject)(action.context) ? action.context[idKey] : action.context;
          var actionOpts = action.options || {};
          var update = actionOpts.assignResponse ? action.body : action.context;
          var listItemIndex = state.items.findIndex(function (el) {
            return el[idKey] === id;
          });
          var updatedItems = state.items.slice();
          if (listItemIndex !== -1) {
            updatedItems[listItemIndex] = _extends({}, updatedItems[listItemIndex], update);
          }
          var updatedItem = state.item && state.item[idKey] === id ? _extends({}, state.item, update) : state.item;
          return _extends({}, state, {
            isUpdating: false,
            items: updatedItems,
            item: updatedItem
          });
        }
      case 'rejected':
        return _extends({}, state, {
          isUpdating: false
        });
      default:
        return state;
    }
  },
  updateMany: function updateMany(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isUpdatingMany: true
        });
      case 'resolved':
        {
          // Assign context or returned object
          var actionOpts = action.options || {};
          var idKey = (0, _util.getIdKey)(action, { multi: false });
          var idKeyMulti = (0, _util.getIdKey)(action, { multi: true });

          var _ref = actionOpts.query || action.context,
              ids = _ref[idKeyMulti];

          var updatedItems = state.items.map(function (item) {
            if (!ids || ids.includes(item[idKey])) {
              var _updatedItem = getUpdateArrayData(action, item[idKey]);
              return _updatedItem ? _extends({}, item, _updatedItem) : item;
            }
            return item;
          });
          // Also impact state.item? (@TODO opt-in/defautl?)
          var updatedItem = state.item && (!ids || ids.includes(state.item[idKey])) ? _extends({}, state.item, getUpdateArrayData(action, state.item[idKey])) : state.item;
          return _extends({}, state, {
            isUpdatingMany: false,
            items: updatedItems,
            item: updatedItem
          });
        }
      case 'rejected':
        return _extends({}, state, {
          isUpdatingMany: false
        });
      default:
        return state;
    }
  },
  delete: function _delete(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isDeleting: true
        });
      case 'resolved':
        // eslint-disable-line
        var idKey = (0, _util.getIdKey)(action, { multi: false });
        var id = action.context[idKey] || action.context;
        return _extends({}, state, {
          isDeleting: false,
          items: [].concat(_toConsumableArray(state.items.filter(function (el) {
            return el[idKey] !== id;
          })))
        });
      case 'rejected':
        return _extends({}, state, {
          isDeleting: false
        });
      default:
        return state;
    }
  },
  deleteMany: function deleteMany(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isDeletingMany: true
        });
      case 'resolved':
        // eslint-disable-line
        var actionOpts = action.options || {};
        var idKey = (0, _util.getIdKey)(action, { multi: false });
        var idKeyMulti = (0, _util.getIdKey)(action, { multi: true });

        var _ref2 = actionOpts.query || action.context,
            ids = _ref2[idKeyMulti];

        if (!ids) {
          return _extends({}, state, {
            isDeletingMany: false,
            items: [],
            item: null
          });
        }
        return _extends({}, state, {
          isDeletingMany: false,
          items: [].concat(_toConsumableArray(state.items.filter(function (el) {
            return !ids.includes(el[idKey]);
          }))),
          item: ids.includes(state.item[idKey]) ? null : state.item
        });
      case 'rejected':
        return _extends({}, state, {
          isDeletingMany: false
        });
      default:
        return state;
    }
  }
};

var createReducer = function createReducer(actionId, _ref3) {
  var resourceName = _ref3.resourceName,
      _ref3$resourcePluralN = _ref3.resourcePluralName,
      resourcePluralName = _ref3$resourcePluralN === undefined ? resourceName + 's' : _ref3$resourcePluralN,
      actionOpts = _objectWithoutProperties(_ref3, ['resourceName', 'resourcePluralName']);

  // Custom reducers
  if (actionOpts.reduce && (0, _util.isFunction)(actionOpts.reduce)) {
    return actionOpts.reduce;
  }
  // Do require a custom reduce function for pure actions
  if (actionOpts.isPure) {
    throw new Error('Missing `reduce` option for pure action `' + actionId + '`');
  }
  // Default reducers
  if (defaultReducers[actionId]) {
    return defaultReducers[actionId];
  }
  // Custom actions
  var gerundName = actionOpts.gerundName || (0, _util.getGerundName)(actionId);
  var gerundStateKey = 'is' + (0, _util.ucfirst)(gerundName);
  return function (state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, _defineProperty({}, gerundStateKey, true));
      case 'resolved':
        // eslint-disable-line
        return _extends({}, state, _defineProperty({}, gerundStateKey, false));
      case 'rejected':
        return _extends({}, state, _defineProperty({}, gerundStateKey, false));
      default:
        return state;
    }
  };
};

var createReducers = function createReducers() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resourceName = _ref4.resourceName,
      resourcePluralName = _ref4.resourcePluralName,
      globalOpts = _objectWithoutProperties(_ref4, ['resourceName', 'resourcePluralName']);

  var actionKeys = Object.keys(actions);
  return actionKeys.reduce(function (actionReducers, actionId) {
    var actionOpts = _extends({}, globalOpts, actions[actionId]);
    var reducerKey = (0, _types.getActionType)(actionId).toLowerCase();
    actionReducers[reducerKey] = createReducer(actionId, _extends({
      resourceName: resourceName,
      resourcePluralName: resourcePluralName
    }, actionOpts));
    return actionReducers;
  }, {});
};

var createRootReducer = function createRootReducer() {
  var reducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resourceName = _ref5.resourceName,
      resourcePluralName = _ref5.resourcePluralName,
      _ref5$scope = _ref5.scope,
      scope = _ref5$scope === undefined ? (0, _types.getTypesScope)(resourceName) : _ref5$scope,
      globalOpts = _objectWithoutProperties(_ref5, ['resourceName', 'resourcePluralName', 'scope']);

  var scopeNamespace = scope ? scope + '/' : '';
  var rootReducer = function rootReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _extends({}, _defaults.initialState);
    var action = arguments[1];

    // Only process relevant namespace
    if (scopeNamespace && !String(action.type).startsWith(scopeNamespace)) {
      return state;
    }
    // Only process relevant action type
    var type = action.type.substr(scopeNamespace.length).toLowerCase();
    // Check for a matching reducer
    if (reducers[type]) {
      return reducers[type](state, action);
    }
    return state;
  };
  return rootReducer;
};

exports.initialState = _defaults.initialState;
exports.defaultReducers = defaultReducers;
exports.createReducer = createReducer;
exports.createReducers = createReducers;
exports.createRootReducer = createRootReducer;
//# sourceMappingURL=index.js.map