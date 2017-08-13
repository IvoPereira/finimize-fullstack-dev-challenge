function getInvalidFields(requiredFields, arrayToValidate) {
  let invalidFields = []

  requiredFields.forEach(field => {
    if (arrayToValidate[field] == null || arrayToValidate[field].length === 0) {
      invalidFields.push( field )
    }
  })

  if (invalidFields.length) {
    return invalidFields
  }

  return []
}

module.exports = {
  getInvalidFields: getInvalidFields
}
