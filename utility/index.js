const utils = {
  returnAlertMessage (keyword) {
    if (keyword.trim().length > 0) {
      return `Oops, we couldn't find a match for '${keyword.trim()}'. Try another one?` 
    }
  }
}

module.exports = utils
