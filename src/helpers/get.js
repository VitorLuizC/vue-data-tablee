import is from './is'
import get from 'object-take'

const DEFAULT_VALIDATE = (value) => !is(value, 'Null')

/**
 * Get value from first object.
 * @param {string} name
 * @param {Deep[]} objects
 * @param {function(*):boolean} [validate]
 * @returns {*}
 */
export const getProperty = (name, objects, validate = DEFAULT_VALIDATE) => {
  const properties = objects.map((object) => get(object, name))
  const property = properties.find((property) => validate(property))
  return property
}

export default get
