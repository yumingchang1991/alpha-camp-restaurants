const utils = {
  returnAlertMessage (keyword) {
    return keyword.trim().length > 0
      ? `Oops, we couldn't find a match for '${keyword.trim()}'. Try another one?`
      : 'Seriously? Your keyword is empty... Try type something and hit search again'
  },

  isSearchQueryEmpty (req) {
    return !req.query || req.query.keyword.trim().length === 0
  },
}

module.exports = utils
