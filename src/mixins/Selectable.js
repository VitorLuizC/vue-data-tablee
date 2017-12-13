const Selectable = ({ rows = 'rows' } = {}) => ({
  props: {
    selectable: Boolean
  },

  data () {
    return {
			selectedRows: [],
			lastClicked: undefined
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
		 * @param {object} event
     */
    select (row, event) {
			if (event.shiftKey && this.lastClicked !== row) {
				this.multipleSelect(row)
				this.lastClicked = row
			} else {
				this.selectedRows = this.isSelected(row)
				? this.selectedRows.filter(selected => selected !== row)
				: [ ...this.selectedRows, row ]
			}
			this.emitSelected()
		},

		/**
     * Set multiple rows active.
     * @param {object} row
     */
    multipleSelect (row) {
			const s1 = this[rows].indexOf(row)
			const s2 = this[rows].indexOf(this.lastClicked)
			const [start, end] = [s1, s2].sort()
			const selectedRange = Array(end - start + 1).fill().map((item, index) => start + index)
			this.selectedRows = this[rows].filter((item, index) => {
				return selectedRange.indexOf(index) >= 0
			})
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
