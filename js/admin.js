let config = {slots: 0}

function createSlotSelector(is24, exclude = 0) {
  let slots = Calendar.time_slots(is24).slice(exclude)
  let select = document.createElement('select')
  for (let i in slots) {
    let option = document.createElement('option')
    option.value = i
    option.innerHTML = slots[i]
    select.appendChild(option)
  }
  return select
}

$(() => {
  $('select')[0].addEventListener("change", () => {
    if (!$('.t_slots select').length) {
      $('.t_slots')[0].appendChild(createSlotSelector($('select')[0].value == 24))
    }
  }, false);
})
