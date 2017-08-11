(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("dlx", [], factory);
	else if(typeof exports === 'object')
		exports["dlx"] = factory();
	else
		root["dlx"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dlx;

var _List = __webpack_require__(1);

var _List2 = _interopRequireDefault(_List);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a root node that is linked to all other non-zero nodes, where data
 * is the row number.
 */
function createLinks(matrix) {
  var rows = [new _List2.default()];
  var columns = [];
  var root = rows[0].addToRow(0);

  // Add header nodes
  for (var c = 0; c < matrix[0].length; c += 1) {
    var node = rows[0].addToRow({ size: -1 });

    columns.push(new _List2.default());
    columns[c].addToColumn(node);
  }

  // Create links for only the non-zero in the matrix
  for (var r = 0; r < matrix.length; r += 1) {
    rows.push(new _List2.default());

    for (var _c = 0; _c < matrix[0].length; _c += 1) {
      if (matrix[r][_c] !== 0) {
        var _node = rows[r + 1].addToRow(r + 1);
        columns[_c].addToColumn(_node);
      }
    }
  }

  return root;
}

/**
 * Return the column node with the smallest number of non-zero nodes.
 */
function chooseColumn(h) {
  var c = h.right;
  var s = c.data.size;

  // For each j <- R[h], R[R[h]], ..., while j =/= h
  for (var j = h.right; j !== h; j = j.right) {
    // If S[j] < s, set c <- j and s <- S[j]
    if (j.data.size < s) {
      c = j;
      s = j.data.size;
    }
  }

  return c;
}

/**
 * Removes c from the header list and removes all rows in c's own list from
 * other column lists they are in.
 */
function cover(c) {
  // Set L[R[c]] <- L[c] and R[L[c]] <- R[c]
  c.right.left = c.left;
  c.left.right = c.right;

  // For each i <- D[c], D[D[c]], ..., while i =/= c
  for (var i = c.down; i !== c; i = i.down) {
    // For each j <- R[i], R[R[i]], ..., while j =/= i
    for (var j = i.right; j !== i; j = j.right) {
      // Set U[D[j]] <- U[j], D[U[j]] <- D[j]
      j.down.up = j.up;
      j.up.down = j.down;
      // Set S[C[j]] <- S[C[j]] - 1
      j.column.data.size -= 1;
    }
  }
}

/**
 * Unremove the rows from bottom to top. It takes place in precisely the
 * reverse order of the covering operation.
 */
function uncover(c) {
  // For each i = U[c], U[U[c]], ..., while i =/= c
  for (var i = c.up; i !== c; i = i.up) {
    // For each j <- L[i], L[L[i]], ..., while j =/= i
    for (var j = i.left; j !== i; j = j.right) {
      // Set S[C[j]] <- S[C[j]] + 1
      j.column.data.size += 1;
      // Set U[D[j]] <- j, D[U[j]] <- j
      j.up.down = j.down;
      j.down.up = j.up;
    }

    // Set L[R[c]] <- c and R[L[c]] <- c
    c.right.left = c;
    c.left.right = c;
  }
}

/**
 * Main dancing links solver.
 */
function dlx(matrix) {
  var h = createLinks(matrix);
  var O = [];
  var solution = [];

  function search(k) {
    // If R[h] = h, store the current solution and return
    if (h.right === h) {
      solution = solution.concat(O);
      return;
    }

    // Otherwise choose a column object c
    var c = chooseColumn(h);

    // Cover column c
    cover(c);

    // For each r <- D[c], D[D[c]], ..., while r =/= c
    for (var r = c.down; r !== c; r = r.down) {
      // Set O_k <- r
      O.push(r.data);

      // For each j <- R[r], R[R[r]], ..., while j =/= r
      for (var j = r.right; j !== r; j = j.right) {
        // Cover column j
        cover(j.column);
      }

      search(k + 1);

      // For each j <- L[r], L[L[r]], ..., while j =/= r
      for (var _j = r.left; _j !== r; _j = _j.left) {
        // Uncover column j
        uncover(_j.column);
      }
    }

    // Uncover column c and return
    uncover(c);
  }

  search(0);

  return solution;
}
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Node = __webpack_require__(2);

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List() {
    _classCallCheck(this, List);

    this.head = null;
    this.tail = null;
  }

  _createClass(List, [{
    key: 'add',
    value: function add(node, prev, next) {
      if (this.head && this.tail) {
        this.tail[next] = node;
      } else {
        this.head = node;
        this.tail = node;
      }

      node[prev] = this.tail;
      this.tail = node;
      this.tail[next] = this.head;
      this.head[prev] = this.tail;

      return node;
    }
  }, {
    key: 'addToRow',
    value: function addToRow(data) {
      return this.add(new _Node2.default(data), 'left', 'right');
    }
  }, {
    key: 'addToColumn',
    value: function addToColumn(node) {
      this.add(node, 'down', 'up');
      node.column = this.head;
      node.column.data.size += 1;
    }
  }]);

  return List;
}();

exports.default = List;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function Node(data) {
  _classCallCheck(this, Node);

  this.data = data;
  this.column = this;
  this.down = this;
  this.left = this;
  this.right = this;
  this.up = this;
};

exports.default = Node;
module.exports = exports["default"];

/***/ })
/******/ ]);
});
//# sourceMappingURL=dlx.js.map