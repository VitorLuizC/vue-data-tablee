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
          @click.prevent="selectAll"
        />
      </th>

      <th
        v-for="(col, index) in cols"
        :key="index"
        :class="getClasses(index, 'header')"
        :style="getStyle(col)"
        :width="col.width || null"
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
        :class="[classy + '-cell', '-content', '-clickable']"
        @click.prevent="select(row, $event)"
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
          :style="getStyle(col)"
          :width="col.width || null"
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
        const custom = this.cols[index][type + 'Class']
        const classes = [
          custom,
          '-' + type,
          this.classy + '-cell',
          this.$getSortClasses(index),
          '-' + this.$getAlignment(index)
        ]

        return classes
      },

      /**
       * Get cell's styles.
       * @param {{ hidden: boolean, align: align }} col
       * @returns {CSSStyleDeclaration}
       */
      getStyle (col) {
        const style = {
          textAlign: col.align || this.align,
          display: col.hidden ? 'none' : undefined,
        }
        return style
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

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,700');

  .data-tablee {
    overflow: hidden;
    border: 1px solid #eaedef;
    border-radius: 5px;
    border-spacing: 0;
  }

  .data-tablee-cell {
    position: relative;
    min-height: calc(27px + 4px);
    padding: 18px;
    border-top: 1px solid #eaedef;

    .data-tablee-row:first-child > & { border-top: 0; }

    &::before {
      position: absolute;
      left: 0;
      top: 50%;
      display: block;
      width: 1px;
      height: 27px;
      background-color: #eaedef;
      transform: translateY(-50%);
      content: '';
    }

    &:first-child::before { content: none; }

    &.-right { text-align: right; }
    &.-left { text-align: left; }
    &.-center { text-align: center; }
    &.-clickable { cursor: pointer; }
  }

  .data-tablee-text {
    font-size: 13px;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 400;
    color: #5e6684;
  }

  .data-tablee-cell.-header {
    background-color: #fdfdfd;

    & > .data-tablee-text,
    & > .data-tablee-icon {
      display: inline-block;
      font-size: 12px;
      font-family: 'Nunito Sans', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      color: #bec0d3;
    }

    & > .data-tablee-icon {
      opacity: 0;
      transition: opacity .3s ease,
                  transform .3s ease;
    }

    &.-sortable {
      cursor: pointer;

      & > .data-tablee-icon { opacity: .2; }

      &:hover > .data-tablee-icon { opacity: .8; }

      &:active > .data-tablee-icon {
        transition: transform .1s ease;
        transform: scale(1.5);
      }

      &.-right { padding-right: 6px; }
    }

    &.-sorting > .data-tablee-icon { opacity: 1; }
  }

  .data-tablee-text { line-height: 1; }
</style>

