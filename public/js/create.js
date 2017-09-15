class Slot {
  constructor(is24) {
    this.is24 = is24
    this.selectors = {}
    this.group = document.createElement('div')
    this.group.appendChild(this.createStartSlot())
    this.group.appendChild(this.createEndSlot(1))
  }

  createSlotSelector(exclude = 0, def) {
    let slots = Calendar.time_slots(this.is24)
    let select = document.createElement('select')
    for (let i in slots) {
      if (i < exclude || (exclude == -1 && i == slots.length-1)) continue
      let option = document.createElement('option')
      option.value = i
      option.innerHTML = slots[i]
      select.appendChild(option)
    }
    if (def && def >= exclude) select.value = def
    return select
  }

  createStartSlot() {
    let slotsel = this.createSlotSelector(-1)
    slotsel.addEventListener('change', event => {
      let prevTime = +this.selectors.end.value
      this.selectors.end.remove()
      slotsel.parentNode.appendChild(this.createEndSlot(+slotsel.value+1, Math.max(prevTime, +slotsel.value+1)))
    })
    this.selectors.start = slotsel
    return slotsel
  }

  createEndSlot(exclude = 0, def) {
    let slotsel = this.createSlotSelector(exclude, def)
    this.selectors.end = slotsel
    return slotsel
  }

  getSlotGroup() {
    return this.group
  }

  getRange() {
    return [+this.selectors.start.value, +this.selectors.end.value]
  }
}

class SlotAdder {
  constructor() {
    this.slots = []
  }

  createButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Add a Time'
    button.addEventListener('click', event => {
      let slot = new Slot($('select.t_format')[0].value == 24)
      this.slots.push(slot)
      $('.t_slots')[0].appendChild(slot.getSlotGroup())
    })
    return button
  }

  getTimes() {
    // Here be dragons
    return Array.from(new Set([].concat(...this.slots.map(x => Array.from({length: x.getRange()[1]-x.getRange()[0]}, (n,i)=>i+x.getRange()[0]))))).sort((a,b)=>a-b)
  }
}

$(() => {
  $('select.t_format')[0].addEventListener("change", event => {
    // TODO: Iterate through all time selectors and convert the format if necessary
  })
  let slot_adder = new SlotAdder()
  $('.slot_button_wrap')[0].appendChild(slot_adder.createButton())

  let picker = new Pikaday({ field: $('input.date')[0], minDate: new Date(), trigger: $('button#date_picker')[0] })

  $('button.submit')[0].addEventListener("click", event => {
    let payload = {
      name: $('input.title')[0].value,
      description: $('input.description')[0].value,
      date: $('input.date')[0].value,
      owner: $('input.name')[0].value,
      times: slot_adder.getTimes()
    }
    
    fetch("/api/events/new/", {
      headers: {'Content-Type': 'application/json'},
      method: "POST",
      body: JSON.stringify(payload)
    })
  })
})
