const utils = {
  returnAlertMessage(keyword) {
    return keyword.trim().length > 0
      ? `Oops, we couldn't find a match for '${keyword.trim()}'. Try another one?`
      : `Seriously? Your keyword is empty... Try type something and hit search again`
  },

  isSearchQueryEmpty(req) {
    return !req.query || req.query.keyword.trim().length === 0
  },

  returnRestaurantFromBody(req, res) {
    if (!req.body) {
      return res.redirect('/')
    }
    return {
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      rating: req.body.rating,
      location: req.body.location,
      phone: req.body.phone,
      image: req.body.image,
      google_map: req.body.google_map,
      description: req.body.description
    }
  }
}

module.exports = utils