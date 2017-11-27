/**
 * Creates a toggler function that toggles a value using two options.
 * @param {A} initial
 * @param {B} other
 * @template A, B
 * @returns {(A|B)}
 */
export default (initial = false, other = true) => {
  return (value) => value !== initial ? initial : other
}
