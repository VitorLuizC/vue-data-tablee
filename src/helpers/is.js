/**
 * Check value's constructor name.
 * @param {*} value
 * @param {string} constructor
 * @returns {boolean}
 */
export default (value, constructor) => {
  const is = Object.prototype.toString.call(value) === `[object ${constructor}]`
  return is
}
