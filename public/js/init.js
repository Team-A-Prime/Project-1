// JQuery shim
let $ = (input) => {
  if (typeof(input) === 'string') return document.querySelectorAll(input)
  if (typeof(input) === 'function') document.addEventListener('DOMContentLoaded', input)
}
