import is from '../helpers/is'
import get, { getProperty } from '../helpers/get'
import T from '../helpers/toggle'

/**
 * Default sort function.
 * @param {(string|number)} a
 * @param {(string|number)} b
 * @returns {number}
 */
const DEFAULT_SORT = (a = '', b = '') => {
  const isNumbers = is(a, 'Number') && is(b, 'Number')
  if (isNumbers) {
    return a - b
  } else {
    return String(a || '').localeCompare(String(b || ''))
  }
}

const Sortable = ({ cols = 'cols', rows = 'rows' } = {}) => ({
  props: {
    /**
     * Defines if it sort and optionally define's default sort function.
     */
    sort: {
      type: [Boolean, Function],
      default: true
    }
  },

  data () {
    return {
      sorter: null,
      sortment: 'ascending'
    }
  },

  computed: {
    $sortedRows () {
      const isSorted = is(this.sorter, 'Number')
      if (!isSorted) {
        return [ ...this[rows] ]
      }

      const sorted = [ ...this[rows] ].sort((a, b) => this.$sort(a, b))
      return sorted
    }
  },

  methods: {
    /**
     * Check if column is sorting.
     * @param {number} index
     * @returns {boolean}
     */
    $isSorting (index) {
      const isSorting = this.sorter === index
      return isSorting
    },

    /**
     * Check if a column is sortable.
     * @param {number} index
     * @returns {boolean}
     */
    $isSortable (index) {
      const isSortable = !!this.$getSort(index)
      return isSortable
    },

    /**
     * Get column's sort setting.
     * @param {number} index
     * @returns {(boolean|function)}
     */
    $getSort (index) {
      const col = this[cols][index]
      const sort = getProperty('sort', [col, this._props])
      return sort
    },

    /**
     * Get column sort classes.
     * @param {number} index
     * @returns {(string|Array.<string, boolean>)[]}
     */
    $getSortClasses (index) {
      const isSortable = this.$isSortable(index)
      const isSorting = this.$isSorting(index)
      const classes = [
        {
          '-sorting': isSorting,
          '-sortable': isSortable,
          '-unsortable': !isSortable,
          ['-' + this.sortment]: isSorting
        }
      ]
      return classes
    },

    /**
     * Get column arrow's.
     * @param {number} index
     * @returns {('▼'|'▲'|'')}
     */
    $getArrow (index) {
      const isSorting = this.$isSorting(index)
      if (!isSorting) return '▲'
      const arrow = this.sortment === 'ascending' ? '▲' : '▼'
      return arrow
    },

    /**
     * Sort a column or change its sortment.
     * @param {number} index
     */
    $setSorter (index) {
      const isSorter = this.$isSorting(index)
      const isSortable = this.$isSortable(index)

      if (isSortable && isSorter) {
        this.sortment = T('ascending', 'descending')(this.sortment)
      } else if (isSortable) {
        this.sorter = index
        this.sortment = 'ascending'
      }
    },

    /**
     * Returns diference between values.
     * This is the sort function.
     * @param {object} rowA
     * @param {object} rowB
     * @returns {number}
     */
    $sort (rowA, rowB) {
      const custom = this.$getSort(this.sorter)
      const sort = is(custom, 'Function') ? custom : DEFAULT_SORT
      const path = this[cols][this.sorter].field
      const number = sort(get(rowA, path), get(rowB, path))
      const result = number * (this.sortment === 'ascending' ? 1 : -1)
      return result
    }
  }
})

export default Sortable
