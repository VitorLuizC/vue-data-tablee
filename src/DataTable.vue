<template>
  <table :class="classy">
    <tr :class="[classy + '-row', '-header']">
      <th
        v-if="selectable"
        :class="[classy + '-cell', '-header', '-clickable']"
      >
        <input
          type="checkbox"
          :class="[classy + '-select', '-all']"
          :checked="isSelectedAll"
					@click="selectAll"
        />
      </th>

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

    <tr
      v-for="(row, rowIndex) in $sortedRows"
      :key="rowIndex"
      :class="[classy + '-row', '-content']">

      <th
        v-if="selectable"
				@click="e => select(row, e)"
        :class="[classy + '-cell', '-content', '-clickable']"
      >
        <input
          type="checkbox"
          :class="[classy + '-select', '-all']"
          :checked="isSelected(row)"
        />
      </th>

      <slot name="row" :row="row" :index="rowIndex">
        <td
          v-for="(col, colIndex) in cols"
          :key="colIndex"
          :class="getClasses(colIndex, 'content')"
        >
          <span :class="classy + '-text'">{{ getText(row, col.field) || empty }}</span>
        </td>
      </slot>
    </tr>
  </table>
</template>

<script>
  import is from './helpers/is'
  import get from './helpers/get'
  import toggle from './helpers/toggle'
  import Alignable from './mixins/Alignable'
  import Selectable from './mixins/Selectable'
  import Sortable from './mixins/Sortable'
  import { isContent } from './helpers/validators'

  export default {
    mixins: [ Sortable(), Alignable(), Selectable() ],
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

    data () {
      return {
        classy: this.$options.name || 'data-tablee'
      }
    },

    methods: {
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
          '-' + this.$getAlignment(index),
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
