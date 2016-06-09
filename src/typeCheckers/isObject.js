var isFunction = require('./isFunction.js');

/**
 * Checks the input for type. If input is of type function then the function
 * will return true, otherwise the function will return false.
 * @function isObject
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - Returns true if input is of type object, otherwise false
 */
function isObject ( varToCheck ) {

  return ( !!varToCheck && ((typeof varToCheck) === 'object')
    && isFunction(varToCheck.hasOwnProperty));
}

module.exports = isObject;
