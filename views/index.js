const view = {
  renderIndexPage(res, restaurantsToRender, searchResult) {
    return res.render('index', {
      restaurants: restaurantsToRender,
      searchResult
    })
  },

  renderShowPage(res, restaurant) {
    return res.render('show', { restaurant })
  },

  renderNewPage(res) {
    return res.render('new')
  },

  renderEditPage(res, restaurant) {
    return res.render('edit', { restaurant })
  }
}

module.exports = view