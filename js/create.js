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

}

$(() => {
  $('select.t_format')[0].addEventListener("change", event => {
    let slot = new Slot($('select')[0].value == 24)
    event.target.remove()
    $('.t_slots')[0].appendChild(slot.createStartSlot())
  }, false);
})
