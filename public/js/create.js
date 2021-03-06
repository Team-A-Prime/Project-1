import $ from '/js/init.js'
import Calendar from '/js/calendar.js'

/**
 * Class for creating time slots
 */
export class Slot {
  /**
   * @param {boolean} is24 - True: 24 hour time, False: 12 hour
   */
  constructor(is24) {
    /** @member {boolean} is24 - True: 24 hour time, False: 12 hour */
    this.is24 = is24

    /** @member {object} selectors - Group of selectors */
    this.selectors = {}

    /** @member {Element} group - Element that stores selectors */
    this.group = document.createElement('div')

    /** @member {Element} start_span - span to contain start-time selector */
    this.start_span = document.createElement('span')
    this.start_span.className = "select"
    this.start_span.appendChild(this.createStartSlot())
    this.group.appendChild(this.start_span)

    /** @member {Element} end_span - span to contain end-time selector */
    this.end_span = document.createElement('span')
    this.end_span.className = "select"
    this.end_span.appendChild(this.createEndSlot(1))
    this.group.appendChild(this.end_span)
  }

  /**
   * Creates a selector for selecting a time slot
   * @param {int} exclude - How many time slots to exclude from the selector
   * @param {int} def - default value of selector
   * @return {Element} Time slot selector
   */
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

  /**
   * Creates the selector for the start time
   * @return {Element} Time slot selector
   */
  createStartSlot() {
    let slotsel = this.createSlotSelector(-1)
    slotsel.addEventListener('change', event => {
      let prevTime = +this.selectors.end.value
      this.selectors.end.remove()
      this.end_span.appendChild(this.createEndSlot(+slotsel.value+1, Math.max(prevTime, +slotsel.value+1)))
    })
    this.selectors.start = slotsel
    return slotsel
  }

  /**
   * Creates the selector for the end time
   * @param {int} exclude - How many time slots to exclude from the selector
   * @param {int} def - default value of selector
   * @return {Element} Time slot selector
   */
  createEndSlot(exclude = 0, def) {
    let slotsel = this.createSlotSelector(exclude, def)
    this.selectors.end = slotsel
    return slotsel
  }

  /**
   * Get element that stores selectors
   * @return {Element} Element that stores selectors
   */
  getSlotGroup() {
    return this.group
  }

  /**
   * Get range of time slots
   * @return {int[]} range of time slots
   */
  getRange() {
    return [+this.selectors.start.value, +this.selectors.end.value]
  }
}

/**
 * Class for managing button that adds time slots
 */
export class SlotAdder {
  /**
   * Initialize the slot adder
   */
  constructor() {
    /** @member {Element[]} slots - Array of groups of time slot selectors */
    this.slots = []

    /** @member {boolean} is24 - True: 24 hour time, False: 12 hour */
    this.is24 = false
  }

  /**
   * Creates the button that adds a group of time selectors
   * @return {Element} button that adds a group of time selectors
   */
  createButton() {
    let button = document.createElement('button')
    button.className = "button"
    button.innerHTML = 'Add a Time'
    button.addEventListener('click', event => {
      let slot = new Slot(this.is24)
      this.slots.push(slot)
      $('.t_slots')[0].appendChild(slot.getSlotGroup())
    })
    return button
  }

  /**
   * Creates array of all times slots that fall inside time slot ranges
   * @return {int[]} Array of all times slots that fall inside time slot ranges
   */
  getTimes() {
    // Here be dragons
    return Array.from(new Set([].concat(...this.slots.map(x => Array.from({length: x.getRange()[1]-x.getRange()[0]}, (n,i)=>i+x.getRange()[0]))))).sort((a,b)=>a-b)
  }
}

$(() => {
  let slot_adder = new SlotAdder()

  $('.is24')[0].addEventListener('click', event => {
    slot_adder.is24 = true
    $('.is12')[0].className='button is12'
    $('.is24')[0].className='button is24 is-info'
    let times = Calendar.time_slots(true)
    $('select').forEach(select => {
      Array.from(select.children).forEach(option => {
        option.innerHTML = times[option.value]
      })
    })
  })

  $('.is12')[0].addEventListener('click', event => {
    slot_adder.is24 = false
    $('.is12')[0].className='button is12 is-info'
    $('.is24')[0].className='button is24'
    let times = Calendar.time_slots(false)
    $('select').forEach(select => {
      Array.from(select.children).forEach(option => {
        option.innerHTML = times[option.value]
      })
    })
  })

  $('.slot_button_wrap')[0].appendChild(slot_adder.createButton())

  let picker = new Pikaday({ field: $('input.date')[0], minDate: new Date(), trigger: $('button#date_picker')[0] })

  $('button.submit')[0].addEventListener("click", event => {
    let payload = {
      name: $('input.intitle')[0].value,
      description: $('input.description')[0].value,
      date: $('input.date')[0].value,
      owner: $('input.name')[0].value,
      times: slot_adder.getTimes()
    }

    for (let i of ['title', 'name', 'date']) {
      if (!payload[i.replace('name','owner').replace('title','name')]) {
        alert("You need to enter a "+i+"!")
        return
      }
    }
    if (!payload.times.length) {
      payload.times = Array.from({length: 48}).map((_,i)=>i)
    }

    fetch("/api/events/new/", {
      headers: {'Content-Type': 'application/json'},
      method: "POST",
      body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
      if (res.status != "ok") {
        alert("Could not contact server, please try again")
        return
      }
      window.location.href = '/event/?id='+res.uid
    })
  })
})
