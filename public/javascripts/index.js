// leverage client-side operation to add event listener on sorting
const sortForm = document.getElementById('sort-form')

sortForm.addEventListener('change', (e) => {
  console.log(document.getElementById('sort-field'))
  console.log(document.getElementById('sort-order'))
  sortForm.submit()
})