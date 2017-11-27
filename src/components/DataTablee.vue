<template>
  <table class="data-tablee">
    <tr class="row data-tablee-row -header">
      <th
        v-for="(col, index) in cols"
        :key="index"
        :class="getClasses(index, 'header')"
        @click="sortCol(index)"
      >
        <span class="text">{{ col.label || empty }}</span>

        <slot
          name="sort-icon"
          :sortment="sortment"
          :sorted="index === sorter"
        >
          <span class="icon">{{ index !== sorter ? '' : sortment === 'ascending' ? '↓' : '↑' }}</span>
        </slot>
      </th>
    </tr>

    <tr
      v-for="(row, index) in sorted"
      :key="index"
      class="row data-tablee-row -content"
    >
      <td
        v-for="(field, index) in row"
        :key="index"
        :class="getClasses(index, 'content')"
      >
        <span class="text">{{ field || empty }}</span>
      </td>
    </tr>
  </table>
</template>

<script>
  import is from '../helpers/is'
  import get from '../helpers/get'
  import toggle from '../helpers/toggle'
  import Sortable from '../mixins/Sortable'

  export default {
    mixins: [ Sortable ],
    props: {
      /**
       * List of col's data.
       */
      cols: {
        type: Array,
        required: true,
        validator: (cols) => {
          const isValid = cols.every((col) => is(col, 'Object'))
          return isValid
        }
      },

      /**
       * List of row's data.
       */
      rows: {
        type: Array,
        required: true,
        validator: (rows) => {
          const isValid = rows.every((row) => is(row, 'Object'))
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

    computed: {
      content () {
        const { rows, cols } = this
        const cross = (a, b) => (λ) => a.map((a) => b.map((b) => λ(a, b)))
        const content = cross(rows, cols)((row, col) => get(row, col.field))
        return content
      }
    },

    methods: {
      /**
       * Sort a column or change its sortment.
       * @param {number} index
       */
      sortCol (index) {
        const isSorter = this.sorter === index
        const isSortable = !!this.getSortable(index)
        const toggleSortment = toggle('ascending', 'descending')

        if (isSortable && isSorter) {
          this.sortment = toggleSortment(this.sortment)
        } else if (isSortable) {
          this.sorter = index
          this.sortment = 'ascending'
        }
      },

      /**
       * Get cell's classes.
       * @param {number} index
       * @param {('header'|'content')} type
       * @returns {(string|Object.<string, boolean>)[]}
       */
      getClasses (index, type) {
        const isSortable = !!this.getSortable(index)
        const isSorting = isSortable && this.sorter === index
        const classes = [
          'data-tablee-cell',
          '-' + type,
          {
            '-sorting': isSorting,
            ['-' + this.sortment]: isSorting,
            '-sortable': isSortable && type === 'header',
            '-unsortable': !isSortable && type === 'header'
          }
        ]

        return classes
      },

      /**
       * Check if column from index specified is sortable.
       * @param {number} index
       * @returns {boolean}
       */
      getSortable (index) {
        const { sort = null } = this.cols[index] || {}
        const sortable = !is(sort, 'Null') ? sort : this.sort
        return sortable
      },

      /**
       * Get value's label.
       * @param {*} value
       * @param {string} field
       * @returns {string}
       */
      getText (value, field) {
        const label = field.split('.').reduce((value, field) => {
          if (is(value, 'Object') && value.hasOwnProperty(field))
            return value[field]
          return null
        }, value)
        return label || this.empty
      }
    }
  }
</script>

<style>
  :root
    --data-tablee-border-color: #000
    --data-tablee-cell-padding: 12px

  .data-tablee
    border-spacing: 0

  .data-tablee-cell
    padding: var(--data-tablee-cell-padding)

    &.-header
      border-bottom: 1px solid var(--data-tablee-border-color)
    &.-header.-sortable
      cursor: pointer
</style>
