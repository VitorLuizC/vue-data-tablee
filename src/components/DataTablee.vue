<template>
  <table class="data-tablee">
    <tr class="row data-tablee-row -header">
      <th
        v-for="(col, index) in cols"
        :key="index"
        class="cell data-tablee-cell -header"
      >{{ getLabel(col, 'label') }}</th>
    </tr>

    <tr
      v-for="(row, index) in rows"
      :key="index"
      class="row data-tablee-row -content"
    >
      <td
        v-for="(col, index) in cols"
        :key="index"
        class="cell data-tablee-cell -content"
      >{{ getLabel(row, col.field) }}</td>
    </tr>
  </table>
</template>

<script>
  import is from '../helpers/is'

  export default {
    props: {
      /**
       * List of col's data.
       */
      cols: {
        type: Array,
        required: true,
        validator: (cols) => {
          const isValid = cols.length && cols.every((col) => is(col, 'Object'))
          return isValid
        }
      },

      /**
       * List of row's data.
       */
      rows: {
        type: Array,
        required: true
      },

      /**
       * Empty cell's character.
       */
      empty: {
        type: String,
        default: ''
      }
    },

    methods: {

      /**
       * Get value's label.
       * @param {*} value
       * @param {string} field
       * @returns {string}
       */
      getLabel (value, field) {
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
    /**
     * Table definitions.
     */
    --data-tablee-border-color: #000
    /**
     * Cell definitions.
     */
    --data-tablee-cell-padding: 12px

  .data-tablee
    border-spacing: 0

  .data-tablee-cell
    padding: var(--data-tablee-cell-padding)

    &.-header
      border-bottom: 1px solid var(--data-tablee-border-color)
</style>
