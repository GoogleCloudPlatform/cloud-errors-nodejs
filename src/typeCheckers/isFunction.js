/**
 * Checks the type of input and returns true if the input is of type function
 * or false if the input is not of type function.
 * @function isFunction
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - true if the input is of type function, otherwise false
 */
function isFunction ( varToCheck ) {

  return ((typeof varToCheck) === 'function');
}

module.exports = isFunction;
