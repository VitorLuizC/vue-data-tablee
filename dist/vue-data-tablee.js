/*!
 * vue-data-tablee v0.7.0
 * (c) 2017-present Vitor Cavalcanti <vitorluizc@outlook.com> (https://vitorluizc.github.io)
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vueDataTablee = factory());
}(this, (function () { 'use strict';

/**
 * Check value's constructor name.
 * @param {*} value
 * @param {string} constructor
 * @returns {boolean}
 */
var is = function (value, constructor) {
  var is = Object.prototype.toString.call(value) === ("[object " + constructor + "]");
  return is
};

var DELIMITER = '.';

/**
 * Spreads path into fields list.
 * @param {string} path
 * @returns {Array.<string>}
 */
var getProperties = function (path) { return is(path, 'String') ? path.split(DELIMITER) : []; };

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
var getValue = function (object, property) {
  var isReachable = is(object, 'Object') && object.hasOwnProperty(property);
  var value = isReachable ? object[property] : null;
  return value
};

/**
 * Get value from object path.
 * @param {Deep} object
 * @param {(string|Array.<string>)} path
 * @returns {(number|boolean|string|null)}
 */
var get = function (object, path) {
  var properties = getProperties(path);
  var value = properties.reduce(getValue, object);
  return value
};

var DEFAULT_VALIDATE = function (value) { return !is(value, 'Null'); };

/**
 * Get value from first object.
 * @param {string} name
 * @param {Deep[]} objects
 * @param {function(*):boolean} [validate]
 * @returns {*}
 */
var getProperty = function (name, objects, validate) {
  if ( validate === void 0 ) validate = DEFAULT_VALIDATE;

  var properties = objects.map(function (object) { return get(object, name); });
  var property = properties.find(function (property) { return validate(property); });
  return property
};

/**
 * Creates a toggler function that toggles a value using two options.
 * @param {A} initial
 * @param {B} other
 * @template A, B
 * @returns {(A|B)}
 */
var T = function (initial, other) {
  if ( initial === void 0 ) initial = false;
  if ( other === void 0 ) other = true;

  return function (value) { return value !== initial ? initial : other; }
};

/**
 * Default sort function.
 * @param {(string|number)} a
 * @param {(string|number)} b
 * @returns {number}
 */
var DEFAULT_SORT = function (a, b) {
  if ( a === void 0 ) a = '';
  if ( b === void 0 ) b = '';

  var isNumbers = is(a, 'Number') && is(b, 'Number');
  if (isNumbers) {
    return a - b
  } else {
    return String(a || '').localeCompare(String(b || ''))
  }
};

var Sortable = function (ref) {
  if ( ref === void 0 ) ref = {};
  var cols = ref.cols; if ( cols === void 0 ) cols = 'cols';
  var rows = ref.rows; if ( rows === void 0 ) rows = 'rows';

  return ({
  props: {
    /**
     * Defines if it sort and optionally define's default sort function.
     */
    sort: {
      type: [Boolean, Function],
      default: true
    }
  },

  data: function data () {
    return {
      sorter: null,
      sortment: 'ascending'
    }
  },

  computed: {
    $sortedRows: function $sortedRows () {
      var this$1 = this;

      var isSorted = is(this.sorter, 'Number');
      if (!isSorted) {
        return [].concat( this[rows] )
      }

      var sorted = [].concat( this[rows] ).sort(function (a, b) { return this$1.$sort(a, b); });
      return sorted
    }
  },

  methods: {
    /**
     * Check if column is sorting.
     * @param {number} index
     * @returns {boolean}
     */
    $isSorting: function $isSorting (index) {
      var isSorting = this.sorter === index;
      return isSorting
    },

    /**
     * Check if a column is sortable.
     * @param {number} index
     * @returns {boolean}
     */
    $isSortable: function $isSortable (index) {
      var isSortable = !!this.$getSort(index);
      return isSortable
    },

    /**
     * Get column's sort setting.
     * @param {number} index
     * @returns {(boolean|function)}
     */
    $getSort: function $getSort (index) {
      var col = this[cols][index];
      var sort = getProperty('sort', [col, this._props]);
      return sort
    },

    /**
     * Get column sort classes.
     * @param {number} index
     * @returns {(string|Array.<string, boolean>)[]}
     */
    $getSortClasses: function $getSortClasses (index) {
      var isSortable = this.$isSortable(index);
      var isSorting = this.$isSorting(index);
      var classes = [
        ( obj = {
          '-sorting': isSorting,
          '-sortable': isSortable,
          '-unsortable': !isSortable
        }, obj['-' + this.sortment] = isSorting, obj )
      ];
      var obj;
      return classes
    },

    /**
     * Get column arrow's.
     * @param {number} index
     * @returns {('▼'|'▲'|'')}
     */
    $getArrow: function $getArrow (index) {
      var isSorting = this.$isSorting(index);
      if (!isSorting) { return '▲' }
      var arrow = this.sortment === 'ascending' ? '▲' : '▼';
      return arrow
    },

    /**
     * Sort a column or change its sortment.
     * @param {number} index
     */
    $setSorter: function $setSorter (index) {
      var isSorter = this.$isSorting(index);
      var isSortable = this.$isSortable(index);

      if (isSortable && isSorter) {
        this.sortment = T('ascending', 'descending')(this.sortment);
      } else if (isSortable) {
        this.sorter = index;
        this.sortment = 'ascending';
      }
    },

    /**
     * Returns diference between values.
     * This is the sort function.
     * @param {object} rowA
     * @param {object} rowB
     * @returns {number}
     */
    $sort: function $sort (rowA, rowB) {
      var custom = this.$getSort(this.sorter);
      var sort = is(custom, 'Function') ? custom : DEFAULT_SORT;
      var path = this[cols][this.sorter].field;
      var number = sort(get(rowA, path), get(rowB, path));
      var result = number * (this.sortment === 'ascending' ? 1 : -1);
      return result
    }
  }
});
};

/**
 * Creates a validator function that checks is value is included in values.
 * @param {Array} values
 * @returns {function(*):boolean}
 */
var includes = function (values) { return function (value) { return values.includes(value); }; };

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
var isContent = function (value) {
  var isObject = function (value) { return is(value, 'Object'); };
  var isContent = is(value, 'Array') && value.every(isObject);
  return isContent
};

var DataTable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{class:_vm.classy},[_c('tr',{class:[_vm.classy + '-row', '-header']},_vm._l((_vm.cols),function(col,index){return _c('th',{key:index,class:_vm.getClasses(index, 'header'),on:{"click":function($event){_vm.$setSorter(index);}}},[_c('span',{class:_vm.classy + '-text'},[_vm._v(_vm._s(_vm.getText(col, 'label') || _vm.empty))]),_vm._v(" "),_vm._t("sort-icon",[_c('span',{class:_vm.classy + '-icon'},[_vm._v(_vm._s(_vm.$getArrow(index)))])],{sortment:_vm.sortment,sorted:_vm.$isSorting(index),arrow:_vm.$getArrow(index)})],2)})),_vm._v(" "),_vm._l((_vm.$sortedRows),function(row,rowIndex){return _vm._t("row",[_c('tr',{class:[_vm.classy + '-row', '-content']},_vm._l((_vm.cols),function(col,colIndex){return _c('td',{key:colIndex,class:_vm.getClasses(colIndex, 'content')},[_c('span',{class:_vm.classy + '-text'},[_vm._v(_vm._s(_vm.getText(row, col.field) || _vm.empty))])])}))],{classy:[_vm.classy + '-row', '-content'],row:row})})],2)},staticRenderFns: [],
  mixins: [ Sortable() ],
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
    },

    /**
     * Default cell's alignment.
     */
    align: {
      type: String,
      default: 'left',
      validator: isAlignment
    }
  },

  data: function data () {
    return {
      classy: this.$options.name || 'data-tablee'
    }
  },

  methods: {
    /**
     * Get column's alignment.
     * @param {number} index
     * @returns {('right'|'left'|'center')}
     */
    getAlignment: function getAlignment (index) {
      var col = this.cols[index];
      var alignment = getProperty('align', [col, this._props], isAlignment);
      return alignment
    },

    /**
     * Get cell's classes.
     * @param {number} index
     * @param {('header'|'content')} type
     * @returns {(string|Object.<string, boolean>)[]}
     */
    getClasses: function getClasses (index, type) {
      var classes = [
        this.classy + '-cell',
        '-' + type,
        '-' + this.getAlignment(index) ].concat( this.$getSortClasses(index)
      );

      return classes
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
  install: function install (Vue, ref) {
    if ( ref === void 0 ) ref = {};
    var name = ref.name; if ( name === void 0 ) name = 'data-tablee';

    Vue.component(name, this);
  }
};

return DataTable;

})));
