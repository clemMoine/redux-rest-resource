'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports.defaultState = exports.defaultTransformResponsePipeline = exports.defaultHeaders = exports.defaultActions = exports.defaultGlobals = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* global fetch */

var _fetch = require('./../helpers/fetch');

var _util = require('./../helpers/util');

var defaultActions = {
  create: { method: 'POST' },
  fetch: { method: 'GET', isArray: true },
  get: { method: 'GET' },
  update: { method: 'PATCH' },
  updateMany: { method: 'PATCH', isArray: true, alias: 'update' },
  delete: { method: 'DELETE' },
  deleteMany: { method: 'DELETE', isArray: true, alias: 'delete' }
};

var defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

var defaultTransformResponsePipeline = [function (res) {
  return (0, _fetch.parseResponse)(res).then(function (body) {
    var transformedResponse = { body: body, code: res.status };
    // Add support for Content-Range parsing when a partial http code is used
    var isPartialContent = res.status === 206;
    if (isPartialContent) {
      transformedResponse.contentRange = (0, _util.parseContentRangeHeader)(res.headers.get('Content-Range'));
    }
    return transformedResponse;
  });
}];

var defaultState = {
  create: {
    isCreating: false
  },
  fetch: {
    items: [],
    isFetching: false,
    lastUpdated: 0,
    didInvalidate: true
  },
  get: {
    item: null,
    isFetchingItem: false,
    lastUpdatedItem: 0,
    didInvalidateItem: true
  },
  update: {
    isUpdating: false
  },
  delete: {
    isDeleting: false
  }
};

var initialState = Object.keys(defaultState).reduce(function (soFar, key) {
  return _extends({}, soFar, defaultState[key]);
}, {});

var defaultGlobals = {
  Promise: Promise,
  fetch: fetch
};

exports.defaultGlobals = defaultGlobals;
exports.defaultActions = defaultActions;
exports.defaultHeaders = defaultHeaders;
exports.defaultTransformResponsePipeline = defaultTransformResponsePipeline;
exports.defaultState = defaultState;
exports.initialState = initialState;
//# sourceMappingURL=index.js.map