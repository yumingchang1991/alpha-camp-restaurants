// leverage client-side operation to add event listener on sorting
const searchForm = document.querySelector('#search-form')
const sortField = document.querySelector('#sort-field')
const sortOrder = document.querySelector('#sort-order')

sortField.addEventListener('change', (e) => {
  searchForm.submit()
})

sortOrder.addEventListener('change', (e) => {
  searchForm.submit()
})
