class Slot {

  constructor(is24) {
    this.is24 = is24
    this.selectors = {}
  }

  createSlotSelector(exclude = 0, def) {
    let slots = Calendar.time_slots(this.is24)
    let select = document.createElement('select')
    for (let i in slots) {
      if (i < exclude) continue
      let option = document.createElement('option')
      option.value = i
      option.innerHTML = slots[i]
      select.appendChild(option)
    }
    if (def && def >= exclude) select.value = def
    return select
  }

  createStartSlot() {
    let slotsel = this.createSlotSelector()
    slotsel.addEventListener('change', event => {
      if (!this.selectors.end) {
        slotsel.parentNode.appendChild(this.createEndSlot(+slotsel.value+1))
      } else {
        let prevTime = +this.selectors.end.value
        this.selectors.end.remove()
        slotsel.parentNode.appendChild(this.createEndSlot(+slotsel.value+1, Math.max(prevTime, +slotsel.value+1)))
      }
    })
    this.selectors.start = slotsel
    return slotsel
  }

  createEndSlot(exclude = 0, def) {
    let slotsel = this.createSlotSelector(exclude, def)
    this.selectors.end = slotsel
    return slotsel
  }

  createSlotGroup() {
    let group = document.createElement('div')
    group.appendChild(this.createStartSlot())
    return group
  }

}

class AddSlot {

  constructor() {
    this.slots = []
  }

  createButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Add a Time'
    button.addEventListener('click', event => {
      let slot = new Slot($('select.t_format')[0].value == 24)
      $('.t_slots')[0].appendChild(slot.createSlotGroup())
    })
    return button
  }
}

$(() => {
  $('select.t_format')[0].addEventListener("change", event => {
    // TODO: Iterate through all time selectors and convert the format if necessary
  })
  let add_slot = new AddSlot()
  $('.slot_button_wrap')[0].appendChild(add_slot.createButton())
})