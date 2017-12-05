const Selectable = ({ rows = 'rows' } = {}) => ({
  props: {
    selectable: Boolean
  },

  data () {
    return {
      selectedRows: []
    }
  },

  computed: {
    isSelectedAll () {
      const isEqualsLength = this[rows].length === this.selectedRows.length
      const isSelectedAll = isEqualsLength && this[rows].every((row) => {
        return this.selectedRows.includes(row)
      })
      return isEqualsLength && isSelectedAll
    }
  },

  watch: {
    rows () {
      this.selectedRows = []
    }
  },

  methods: {
    /**
     * Check if a row is selected.
     * @param {object} row 
     * @returns {boolean}
     */
    isSelected (row) {
      const isSelected = !!this.selectedRows.find(selected => selected === row)
      return isSelected
    },

    /**
     * Set row active.
     * @param {object} row 
     */
    select (row) {
      this.selectedRows = this.isSelected(row)
        ? this.selectedRows.filter(selected => selected !== row)
        : [ ...this.selectedRows, row ]
      this.emitSelected()
    },

    /**
     * Set all rows active.
     * @param {Event} event
     */
    selectAll (event) {
      this.selectedRows = this.isSelectedAll ? [] : [ ...this[rows] ]
      this.emitSelected()
    },

    /**
     * Emit selected rows.
     */
    emitSelected () {
      this.$emit('select', this.selectedRows)
    }
  }
})

export default Selectable
