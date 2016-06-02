function isObject ( varToCheck ) {

  return ( !!varToCheck && ((typeof varToCheck) === 'object'));
}

module.exports = isObject;
