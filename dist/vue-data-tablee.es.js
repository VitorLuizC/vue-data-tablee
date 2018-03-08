/*!
 * vue-data-tablee v0.12.1
 * (c) 2018-present Vitor Cavalcanti <vitorluizc@outlook.com> (https://vitorluizc.github.io)
 * Released under the MIT License.
 */
/**
 * Check value's constructor name.
 * @param {*} value
 * @param {string} constructor
 * @returns {boolean}
 */
var is = (function (value, constructor) {
  var is = Object.prototype.toString.call(value) === "[object ".concat(constructor, "]");
  return is;
});

var DELIMITER = '.';
/**
 * Spreads path into fields list.
 * @param {string} path
 * @returns {Array.<string>}
 */

var getProperties = function getProperties(path) {
  return is(path, 'String') ? path.split(DELIMITER) : [];
};
/**
 * Deep object.
 * @typedef {Object.<string, (number|boolean|string|Deep)>} Deep
 */

/**
 * Checks if a propety is reachable.
 * @param {Deep} object
 * @param {string} property
 * @returns {(number|boolean|string|null)}
 */


var getValue = function getValue(object, property) {
  var isReachable = is(object, 'Object') && object.hasOwnProperty(property);
  var value = isReachable ? object[property] : null;
  return value;
};
/**
 * Get value from object path.
 * @param {Deep} object
 * @param {(string|Array.<string>)} path
 * @returns {(number|boolean|string|null)}
 */


var get = function get(object, path) {
  var properties = getProperties(path);
  var value = properties.reduce(getValue, object);
  return value;
};

var DEFAULT_VALIDATE = function DEFAULT_VALIDATE(value) {
  return !is(value, 'Null');
};
/**
 * Get value from first object.
 * @param {string} name
 * @param {Deep[]} objects
 * @param {function(*):boolean} [validate]
 * @returns {*}
 */


var getProperty = function getProperty(name, objects) {
  var validate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_VALIDATE;
  var properties = objects.map(function (object) {
    return get(object, name);
  });
  var property = properties.find(function (property) {
    return validate(property);
  });
  return property;
};

/**
 * Creates a toggler function that toggles a value using two options.
 * @param {A} initial
 * @param {B} other
 * @template A, B
 * @returns {(A|B)}
 */

/**
 * Creates a validator function that checks is value is included in values.
 * @param {Array} values
 * @returns {function(*):boolean}
 */

var includes = function includes(values) {
  return function (value) {
    return values.includes(value);
  };
};

var ALIGNMENTS = ['right', 'left', 'center'];
/**
 * Checks if value is an alignment.
 */

var isAlignment = includes(ALIGNMENTS);
/**
 * Checks if value is a list of objects.
 * @param {*} value
 * @returns {boolean}
 */

var isContent = function isContent(value) {
  var isObject = function isObject(value) {
    return is(value, 'Object');
  };

  var isContent = is(value, 'Array') && value.every(isObject);
  return isContent;
};

var Alignable = function Alignable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$cols = _ref.cols,
      cols = _ref$cols === void 0 ? 'cols' : _ref$cols;

  return {
    props: {
      /**
       * Default cell's alignment.
       */
      align: {
        type: String,
        default: 'left',
        validator: isAlignment
      }
    },
    methods: {
      /**
       * Get column's alignment.
       * @param {number} index
       * @returns {('right'|'left'|'center')}
       */
      $getAlignment: function $getAlignment(index) {
        var col = this[cols][index];
        var alignment = getProperty('align', [col, this._props], isAlignment);
        return alignment;
      }
    }
  };
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _sliceIterator(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _slicedToArray(arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    return _sliceIterator(arr, i);
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
}

var Selectable = function Selectable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$rows = _ref.rows,
      rows = _ref$rows === void 0 ? 'rows' : _ref$rows;

  return {
    props: {
      selectable: Boolean
    },
    data: function data() {
      return {
        selectedRows: [],
        lastClicked: undefined
      };
    },
    computed: {
      isSelectedAll: function isSelectedAll() {
        var _this = this;

        var isNotEmpty = !!this[rows].length;
        var isEqualsLength = isNotEmpty && this[rows].length === this.selectedRows.length;
        var isSelectedAll = isEqualsLength && this[rows].every(function (row) {
          return _this.selectedRows.includes(row);
        });
        return isSelectedAll;
      }
    },
    watch: {
      rows: function rows() {
        this.selectedRows = [];
      }
    },
    methods: {
      /**
       * Check if a row is selected.
       * @param {object} row
       * @returns {boolean}
       */
      isSelected: function isSelected(row) {
        var isSelected = !!this.selectedRows.find(function (selected) {
          return selected === row;
        });
        return isSelected;
      },

      /**
       * Set row active.
       * @param {object} row
       * @param {object} event
       */
      select: function select(row, event) {
        if (event.shiftKey && this.lastClicked !== row) {
          this.multipleSelect(row);
        } else {
          this.selectedRows = this.isSelected(row) ? this.selectedRows.filter(function (selected) {
            return selected !== row;
          }) : _toConsumableArray(this.selectedRows).concat([row]);
        }

        this.lastClicked = row;
        this.emitSelected();
      },

      /**
       * Set multiple rows active.
       * @param {object} row
       */
      multipleSelect: function multipleSelect(row) {
        var s1 = this[rows].indexOf(row);
        var s2 = this[rows].indexOf(this.lastClicked);

        var _sort = [s1, s2].sort(),
            _sort2 = _slicedToArray(_sort, 2),
            start = _sort2[0],
            end = _sort2[1];

        var range = Array(end - start + 1).fill().map(function (_, index) {
          return start + index;
        });
        this.selectedRows = this[rows].filter(function (_, index) {
          return range.includes(index);
        });
      },

      /**
       * Set all rows active.
       * @param {Event} event
       */
      selectAll: function selectAll(event) {
        this.selectedRows = this.isSelectedAll ? [] : _toConsumableArray(this[rows]);
        this.emitSelected();
      },

      /**
       * Emit selected rows.
       */
      emitSelected: function emitSelected() {
        this.$emit('select', this.selectedRows);
      }
    }
  };
};

/**
 * Default sort function.
 * @param {(string|number)} a
 * @param {(string|number)} b
 * @returns {number}
 */

var DEFAULT_SORT = function DEFAULT_SORT() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var isNumbers = is(a, 'Number') && is(b, 'Number');

  if (isNumbers) {
    return a - b;
  } else {
    return String(a || '').localeCompare(String(b || ''));
  }
};

var Sortable = function Sortable() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$cols = _ref.cols,
      cols = _ref$cols === void 0 ? 'cols' : _ref$cols,
      _ref$rows = _ref.rows,
      rows = _ref$rows === void 0 ? 'rows' : _ref$rows;

  return {
    props: {
      /**
       * Defines if it sort and optionally define's default sort function.
       */
      sort: {
        type: [Boolean, Function],
        default: true
      },

      /**
       * Defines if sort just emit events.
       */
      sortExternal: Boolean
    },
    data: function data() {
      return {
        sorter: null,
        sortment: 'ascending'
      };
    },
    computed: {
      $sortedRows: function $sortedRows() {
        var _this = this;

        var isSorted = is(this.sorter, 'Number');

        if (!isSorted || this.sortExternal) {
          return _toConsumableArray(this[rows]);
        }

        var sorted = _toConsumableArray(this[rows]).sort(function (a, b) {
          return _this.$sort(a, b);
        });

        return sorted;
      }
    },
    methods: {
      /**
       * Check if column is sorting.
       * @param {number} index
       * @returns {boolean}
       */
      $isSorting: function $isSorting(index) {
        var isSorting = this.sorter === index;
        return isSorting;
      },

      /**
       * Check if a column is sortable.
       * @param {number} index
       * @returns {boolean}
       */
      $isSortable: function $isSortable(index) {
        var isSortable = !!this.$getSort(index);
        return isSortable;
      },

      /**
       * Get column's sort setting.
       * @param {number} index
       * @returns {(boolean|function)}
       */
      $getSort: function $getSort(index) {
        var col = this[cols][index];
        var sort = getProperty('sort', [col, this._props]);
        return sort;
      },

      /**
       * Get column sort classes.
       * @param {number} index
       * @returns {(string|Array.<string, boolean>)[]}
       */
      $getSortClasses: function $getSortClasses(index) {
        var isSortable = this.$isSortable(index);
        var isSorting = this.$isSorting(index);

        var classes = _defineProperty({
          '-sorting': isSorting,
          '-sortable': isSortable,
          '-unsortable': !isSortable
        }, '-' + this.sortment, isSorting);

        return classes;
      },

      /**
       * Get column arrow's.
       * @param {number} index
       * @returns {('▼'|'▲'|'')}
       */
      $getArrow: function $getArrow(index) {
        var isSorting = this.$isSorting(index);
        if (!isSorting) return '▲';
        var arrow = this.sortment === 'ascending' ? '▲' : '▼';
        return arrow;
      },

      /**
       * Sort a column or change its sortment.
       * @param {number} index
       */
      $setSorter: function $setSorter(index) {
        var isSorter = this.$isSorting(index);
        var isSortable = this.$isSortable(index);

        if (!isSortable) {
          return;
        }

        var column = this[cols][index];
        var sortment = !isSorter || this.sortment === 'descending' ? 'ascending' : 'descending';
        this.sortment = sortment;
        this.sorter = index;
        this.$emit('sort', {
          column: column,
          sortment: sortment
        });
      },

      /**
       * Returns diference between values.
       * This is the sort function.
       * @param {object} rowA
       * @param {object} rowB
       * @returns {number}
       */
      $sort: function $sort(rowA, rowB) {
        var custom = this.$getSort(this.sorter);
        var sort = is(custom, 'Function') ? custom : DEFAULT_SORT;
        var path = this[cols][this.sorter].field;
        var number = sort(get(rowA, path), get(rowB, path));
        var result = number * (this.sortment === 'ascending' ? 1 : -1);
        return result;
      }
    }
  };
};

var DataTable = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('table', {
      class: _vm.classy
    }, [_c('tr', {
      class: [_vm.classy + '-row', '-header']
    }, [_vm.selectable ? _c('th', {
      class: [_vm.classy + '-cell', '-header', '-clickable']
    }, [_c('input', {
      class: [_vm.classy + '-select', '-all'],
      attrs: {
        "type": "checkbox"
      },
      domProps: {
        "checked": _vm.isSelectedAll
      },
      on: {
        "click": function click($event) {
          $event.preventDefault();

          _vm.selectAll($event);
        }
      }
    })]) : _vm._e(), _vm._v(" "), _vm._l(_vm.cols, function (col, index) {
      return _c('th', {
        key: index,
        class: _vm.getClasses(index, 'header'),
        style: _vm.getStyle(col),
        attrs: {
          "width": col.width || null
        },
        on: {
          "click": function click($event) {
            _vm.$setSorter(index);
          }
        }
      }, [_c('span', {
        class: _vm.classy + '-text'
      }, [_vm._v(_vm._s(_vm.getText(col, 'label') || _vm.empty))]), _vm._v(" "), _vm._t("sort-icon", [_c('span', {
        class: _vm.classy + '-icon'
      }, [_vm._v(_vm._s(_vm.$getArrow(index)))])], {
        sortment: _vm.sortment,
        sorted: _vm.$isSorting(index),
        arrow: _vm.$getArrow(index)
      })], 2);
    })], 2), _vm._v(" "), _vm._l(_vm.$sortedRows, function (row, rowIndex) {
      return _c('tr', {
        key: rowIndex,
        class: [_vm.classy + '-row', '-content']
      }, [_vm.selectable ? _c('th', {
        class: [_vm.classy + '-cell', '-content', '-clickable'],
        on: {
          "click": function click($event) {
            $event.preventDefault();

            _vm.select(row, $event);
          }
        }
      }, [_c('input', {
        class: [_vm.classy + '-select', '-all'],
        attrs: {
          "type": "checkbox"
        },
        domProps: {
          "checked": _vm.isSelected(row)
        }
      })]) : _vm._e(), _vm._v(" "), _vm._t("row", _vm._l(_vm.cols, function (col, colIndex) {
        return _c('td', {
          key: colIndex,
          class: _vm.getClasses(colIndex, 'content'),
          style: _vm.getStyle(col),
          attrs: {
            "width": col.width || null
          }
        }, [_c('span', {
          class: _vm.classy + '-text'
        }, [_vm._v(_vm._s(_vm.getText(row, col.field) || _vm.empty))])]);
      }), {
        row: row,
        index: rowIndex
      })], 2);
    })], 2);
  },
  staticRenderFns: [],
  mixins: [Sortable(), Alignable(), Selectable()],
  props: {
    /**
     * List of col's data.
     */
    cols: {
      type: Array,
      required: true,
      validator: isContent
    },

    /**
     * List of row's data.
     */
    rows: {
      type: Array,
      required: true,
      validator: isContent
    },

    /**
     * Empty cell's character.
     */
    empty: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      classy: this.$options.name || 'data-tablee'
    };
  },
  methods: {
    /**
     * Get cell's classes.
     * @param {number} index
     * @param {('header'|'content')} type
     * @returns {(string|Object.<string, boolean>)[]}
     */
    getClasses: function getClasses(index, type) {
      var custom = this.cols[index][type + 'Class'];
      var classes = [custom, '-' + type, this.classy + '-cell', this.$getSortClasses(index), '-' + this.$getAlignment(index)];
      return classes;
    },

    /**
     * Get cell's styles.
     * @param {{ hidden: boolean, align: align }} col
     * @returns {CSSStyleDeclaration}
     */
    getStyle: function getStyle(col) {
      var style = {
        textAlign: col.align || this.align,
        display: col.hidden ? 'none' : undefined
      };
      return style;
    },

    /**
     * Get value's label.
     * @param {*} value
     * @param {string} path
     * @returns {string}
     */
    getText: get
  },

  /**
   * Install DataTablee components.
   * @param {Vue} Vue
   * @param {{ name: string }} [options]
   */
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? 'data-tablee' : _ref$name;

    Vue.component(name, this);
  }
};

export default DataTable;
