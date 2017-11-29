<template>
  <table :class="classy">
    <tr :class="[classy + '-row', '-header']">
      <th
        v-for="(col, index) in cols"
        :key="index"
        :class="getClasses(index, 'header')"
        @click="$setSorter(index)"
      >
        <span :class="classy + '-text'">{{ getText(col, 'label') || empty }}</span>

        <slot
          name="sort-icon"
          :sortment="sortment"
          :sorted="$isSorting(index)"
          :arrow="$getArrow(index)"
        >
          <span :class="classy + '-icon'">{{ $getArrow(index) }}</span>
        </slot>
      </th>
    </tr>


    <slot
      v-for="(row, rowIndex) in $sortedRows"
      name="row"
      :classy="[classy + '-row', '-content']"
      :row="row"
    >
      <tr :class="[classy + '-row', '-content']">
        <td
          v-for="(col, colIndex) in cols"
          :key="colIndex"
          :class="getClasses(colIndex, 'content')"
        >
          <span :class="classy + '-text'">{{ getText(row, col.field) || empty }}</span>
        </td>
      </tr>
    </slot>
  </table>
</template>

<script>
  import is from './helpers/is'
  import get, { getProperty } from './helpers/get'
  import toggle from './helpers/toggle'
  import Sortable from './mixins/Sortable'
  import { isContent, isAlignment } from './helpers/validators'

  export default {
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

    data () {
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
      getAlignment (index) {
        const col = this.cols[index]
        const alignment = getProperty('align', [col, this._props], isAlignment)
        return alignment
      },

      /**
       * Get cell's classes.
       * @param {number} index
       * @param {('header'|'content')} type
       * @returns {(string|Object.<string, boolean>)[]}
       */
      getClasses (index, type) {
        const classes = [
          this.classy + '-cell',
          '-' + type,
          '-' + this.getAlignment(index),
          ...this.$getSortClasses(index)
        ]

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
    install (Vue, { name = 'data-tablee' } = {}) {
      Vue.component(name, this)
    }
  }
</script>
