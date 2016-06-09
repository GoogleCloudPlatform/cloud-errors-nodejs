/**
 * Checks the input for type. If input is of type number then the function will
 * return true, otherwise the function will return false.
 * @function isNumber
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - Returns true if input is of type number, otherwise false
 */
function isNumber ( varToCheck ) {

  return ((typeof varToCheck) === 'number');
}

module.exports = isNumber;
