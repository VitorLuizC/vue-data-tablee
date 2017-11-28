/*!
 * vue-data-tablee v0.4.1
 * (c) 2017-present Vitor Cavalcanti <vitorluizc@outlook.com> (https://vitorluizc.github.io)
 * Released under the MIT License.
 */
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

/**
 * Creates a toggler function that toggles a value using two options.
 * @param {A} initial
 * @param {B} other
 * @template A, B
 * @returns {(A|B)}
 */
var toggle = function (initial, other) {
  if ( initial === void 0 ) initial = false;
  if ( other === void 0 ) other = true;

  return function (value) { return value !== initial ? initial : other; }
};

var Sortable = {
  data: function data () {
    return {
      sorter: null,
      sortment: 'ascending'
    }
  },

  computed: {
    sorted: function sorted () {
      var this$1 = this;

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

      var sort = is(this.getSortable(this.sorter), 'Function')
        ? this.getSortable(this.sorter)
        : DEFAULT_SORT;
      var λ = function (ref, ref$1) {
        var a = ref[this$1.sorter];
        var b = ref$1[this$1.sorter];

        return sort(a, b);
      };
      var sorted = this.sortment === 'ascending'
        ? this.content.sort(λ)
        : this.content.sort(λ).reverse();
      return sorted
    }
  }
};

var DataTable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{class:_vm.classy},[_c('tr',{class:[_vm.classy + '-row', '-header']},_vm._l((_vm.cols),function(col,index){return _c('th',{key:index,class:_vm.getClasses(index, 'header'),on:{"click":function($event){_vm.sortCol(index);}}},[_c('span',{class:_vm.classy + '-text'},[_vm._v(_vm._s(col.label || _vm.empty))]),_vm._v(" "),_vm._t("sort-icon",[_c('span',{class:_vm.classy + '-icon'},[_vm._v(_vm._s(_vm.getArrow(index)))])],{sortment:_vm.sortment,sorted:index === _vm.sorter,arrow:_vm.getArrow(index)})],2)})),_vm._v(" "),_vm._l((_vm.sorted),function(row,index){return _c('tr',{key:index,class:[_vm.classy + '-row', '-content']},_vm._l((row),function(field,index){return _c('td',{key:index,class:_vm.getClasses(index, 'content')},[_c('span',{class:_vm.classy + '-text'},[_vm._v(_vm._s(field || _vm.empty))])])}))})],2)},staticRenderFns: [],
  mixins: [ Sortable ],
  props: {
    /**
     * List of col's data.
     */
    cols: {
      type: Array,
      required: true,
      validator: function (cols) {
        var isValid = cols.every(function (col) { return is(col, 'Object'); });
        return isValid
      }
    },

    /**
     * List of row's data.
     */
    rows: {
      type: Array,
      required: true,
      validator: function (rows) {
        var isValid = rows.every(function (row) { return is(row, 'Object'); });
        return isValid
      }
    },

    /**
     * Empty cell's character.
     */
    empty: {
      type: String,
      default: ''
    },

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
      classy: this.$options.name || 'data-tablee'
    }
  },

  computed: {
    content: function content () {
      var ref = this;
      var rows = ref.rows;
      var cols = ref.cols;
      var cross = function (a, b) { return function (λ) { return a.map(function (a) { return b.map(function (b) { return λ(a, b); }); }); }; };
      var content = cross(rows, cols)(function (row, col) { return get(row, col.field); });
      return content
    }
  },

  methods: {
    /**
     * Sort a column or change its sortment.
     * @param {number} index
     */
    sortCol: function sortCol (index) {
      var isSorter = this.sorter === index;
      var isSortable = !!this.getSortable(index);
      var toggleSortment = toggle('ascending', 'descending');

      if (isSortable && isSorter) {
        this.sortment = toggleSortment(this.sortment);
      } else if (isSortable) {
        this.sorter = index;
        this.sortment = 'ascending';
      }
    },

    /**
     * Get column arrow's.
     * @param {number} index
     * @returns {('▼'|'▲'|'')}
     */
    getArrow: function getArrow (index) {
      var isSorting = index === this.sorter;
      if (!isSorting)
        { return '▲' }
      var arrow = this.sortment === 'ascending' ? '▲' : '▼';
      return arrow
    },

    /**
     * Get cell's classes.
     * @param {number} index
     * @param {('header'|'content')} type
     * @returns {(string|Object.<string, boolean>)[]}
     */
    getClasses: function getClasses (index, type) {
      var isSortable = !!this.getSortable(index);
      var isSorting = isSortable && this.sorter === index;
      var classes = [
        this.classy + '-cell',
        '-' + type,
        ( obj = {
          '-sorting': isSorting,
          '-sortable': isSortable && type === 'header',
          '-unsortable': !isSortable && type === 'header'
        }, obj['-' + this.sortment] = isSorting, obj )
      ];
      var obj;

      return classes
    },

    /**
     * Check if column from index specified is sortable.
     * @param {number} index
     * @returns {boolean}
     */
    getSortable: function getSortable (index) {
      var ref = this.cols[index] || {};
      var sort = ref.sort; if ( sort === void 0 ) sort = null;
      var sortable = !is(sort, 'Null') ? sort : this.sort;
      return sortable
    },

    /**
     * Get value's label.
     * @param {*} value
     * @param {string} field
     * @returns {string}
     */
    getText: function getText (value, field) {
      var label = field.split('.').reduce(function (value, field) {
        if (is(value, 'Object') && value.hasOwnProperty(field))
          { return value[field] }
        return null
      }, value);
      return label || this.empty
    }
  },

  /**
   * Install DataTablee components.
   * @param {Vue} Vue
   * @param {{ name: string }} [options]
   */
  install: function install (Vue, ref) {
    if ( ref === void 0 ) ref = {};
    var name = ref.name; if ( name === void 0 ) name = 'data-tablee';

    Vue.component(name, Object.assign({}, this, {name: name}));
  }
};

export default DataTable;
