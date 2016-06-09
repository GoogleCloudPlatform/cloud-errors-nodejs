/**
 * Checks the input for type. If input is of type string then the function
 * will return true, otherwise the function will return false.
 * @function isString
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - Returns true if input is of type string, otherwise false
 */
function isString ( varToCheck ) {

  return ((typeof varToCheck) === 'string');
}

module.exports = isString;
