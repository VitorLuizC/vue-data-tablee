import { getProperty } from '../helpers/get'
import { isAlignment } from '../helpers/validators'

const Alignable = ({ cols = 'cols' } = {}) => ({
  props: {
    /**
     * Default cell's alignment.
     */
    align: {
      type: String,
      default: 'left',
      validator: isAlignment
    }
  },
  methods: {
  /**
    * Get column's alignment.
    * @param {number} index
    * @returns {('right'|'left'|'center')}
    */
   $getAlignment (index) {
     const col = this[cols][index]
     const alignment = getProperty('align', [col, this._props], isAlignment)
     return alignment
   }
  }
})

export default Alignable
