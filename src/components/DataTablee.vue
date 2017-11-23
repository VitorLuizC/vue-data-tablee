<template>
  <table class="data-tablee">
    <tr class="row data-tablee-row -header">
      <th
        v-for="(col, index) in cols"
        :key="index"
        class="cell data-tablee-cell -header"
      >
        <span class="text">{{ getText(col, 'label') }}</span>
      </th>
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
      >
        <span class="text">{{ getText(row, col.field) }}</span>
      </td>
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
      }
    },
    methods: {
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
</style>
