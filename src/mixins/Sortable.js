import is from '../helpers/is'

const Sortable = {
  data () {
    return {
      sorter: null,
      sortment: 'ascending'
    }
  },

  computed: {
    sorted () {
      const DEFAULT_SORT = (a = '', b = '') => {
        const isNumbers = is(a, 'Number') && is(b, 'Number')
        if (isNumbers) {
          return a - b
        } else {
          return String(a || '').localeCompare(String(b || ''))
        }
      }

      const sort = is(this.getSortable(this.sorter), 'Function')
        ? this.getSortable(this.sorter)
        : DEFAULT_SORT
      const λ = ({ [this.sorter]: a }, { [this.sorter]: b }) => sort(a, b)
      const sorted = this.sortment === 'ascending'
        ? this.content.sort(λ)
        : this.content.sort(λ).reverse()
      return sorted
    }
  }
}

export default Sortable
