import $ from '/js/init.js'
import Calendar from '/js/calendar.js'

export class EventPage {
  constructor(event) {
    this.event = event
  }

  createAttendeeTable() {
    let slots = Calendar.time_slots(false)
    let t_cont = document.createElement('div')
    t_cont.className = "table_container"
    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    let thead = document.createElement('thead')
    let tr = document.createElement('tr')
    let th = document.createElement('th')
    tr.appendChild(th)
    for (let i in this.event.times) {
      let th = document.createElement('th')
      th.innerHTML = slots[this.event.times[i]]
      tr.appendChild(th)
    }
    thead.appendChild(tr)
    table.appendChild(thead)
    table.appendChild(tbody)
    for (let attendee of this.event.attendees) {
      let tr = document.createElement('tr')
      let name = document.createElement('td')
      if (attendee.name == this.event.owner) {
        name.className = "owner"
      }
      name.innerHTML = attendee.name
      tr.appendChild(name)
      for (let i in this.event.times) {
        let td = document.createElement('td')
        if (i && this.event.times[i]-this.event.times[i-1] != 1) {
          // Create spacer
        }
        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        if (attendee.times.includes(this.event.times[i])) {
          checkbox.checked = "checked"
        }
        checkbox.disabled = true
        td.appendChild(checkbox)
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    let utr = document.createElement('tr')
    let utd = document.createElement('td')
    let uinput = document.createElement('input')
    uinput.className = "input is-small"
    uinput.placeholder = "Your name"
    this.name = uinput
    utd.appendChild(uinput)
    utr.appendChild(utd)
    for (let i of this.event.times) {
      let td = document.createElement('td')
      let checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = i
      td.appendChild(checkbox)
      utr.appendChild(td)
    }
    tbody.appendChild(utr)
    let ttr = document.createElement('tr')
    let ttd = document.createElement('td')
    ttd.innerHTML = 'Participants'
    ttd.className = 'check_count'
    ttr.appendChild(ttd)
    for (let i of this.event.times) {
      let td = document.createElement('td')
      td.className = 'check_count'
      td.innerHTML = [].concat(...this.event.attendees.map(a=>a.times)).filter(a=>a==i).length
      ttr.appendChild(td)
    }
    tbody.appendChild(ttr)
    t_cont.appendChild(table)
    return t_cont
  }

  createSignupButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Register'
    button.className = 'button is-primary'
    button.addEventListener('click', event => {
      let payload = {}
      payload.uid = this.event.uid
      payload.name = this.name.value
      payload.times = Array.from($('input[type="checkbox"][value]:checked')).map(el => +el.value)
      if (!payload.name) {
        alert("You must enter your name!")
        return
      }
      fetch('/api/events/register/', {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify(payload)
      }).then(res => res.json()).then(res => {
        if (res.status != "ok") {
          alert("Could not contact server, please try again")
          return
        }
        window.location.reload()
      })
    })
    return button
  }

  createEventInfo() {
    let eventInfo = document.createElement('div')

    eventInfo.appendChild(this.createAttendeeTable())
    eventInfo.appendChild(this.createSignupButton())

    return eventInfo
  }
}

$(() => {
  let event_id = (new URLSearchParams(window.location.search)).get('id')
  fetch('/api/events/?uid='+event_id).then(res => res.json()).then(event => {
    if (!event) { /* TODO: Show error and bail */ }
    event.attendees = [].concat({name: event.owner, times: event.times}, event.attendees)
    let event_page = new EventPage(event)
    $('h1.title')[0].innerHTML = event.name
    $('h2.event_date')[0].innerHTML = event.date
    $('h2.subtitle')[0].innerHTML = event.description
    $('.content_card')[0].append(event_page.createEventInfo(event))
  })
})
