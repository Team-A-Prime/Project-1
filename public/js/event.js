class EventPage {
  constructor(event) {
    this.event = event
  }

  createEventName() {
    let eventName = document.createElement('h1')
    eventName.innerHTML = this.event.name
    eventName.className = 'event_title'
    return eventName
  }

  createEventDate() {
    let eventDate = document.createElement('h3')
    // TODO: Add Date parsing?
    eventDate.innerHTML = this.event.date
    eventDate.className = 'event_date'
    return eventDate
  }

  createAttendeeTable() {
    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    table.appendChild(tbody)
    let thead = document.createElement('thead')
    let tr = document.createElement('tr')
    let th = document.createElement('th')
    th.innerHTML = 'Name'
    tr.appendChild(th)
    for (let i in this.event.times) {
      let th = document.createElement('th')
      th.innerHTML = this.event.times[i]
      tr.appendChild(th)
    }
    thead.appendChild(tr)
    table.appendChild(thead)
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
    utd.appendChild(uinput)
    utr.appendChild(utd)
    for (let i in this.event.times) {
      let td = document.createElement('td')
      let checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      td.appendChild(checkbox)
      utr.appendChild(td)
    }
    tbody.appendChild(utr)
    return table
  }

  createSignupButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Register'
    // TODO: make button collect info
    button.addEventListener('click', event => {
      fetch('/api/events/register/', {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify()
      })
    })
    return button
  }

  createEventInfo() {
    let eventInfo = document.createElement('div')

    eventInfo.appendChild(this.createEventName())
    eventInfo.appendChild(this.createEventDate())
    eventInfo.appendChild(this.createAttendeeTable())
    eventInfo.appendChild(this.createSignupButton())

    return eventInfo
  }
}

$(() => {
  let event_id = (new URLSearchParams(window.location.search)).get('id')
  fetch('/api/events/?uid='+event_id).then(res => res.json()).then(event => {
    event.attendees = [].concat({name: event.owner, times: event.times}, event.attendees)
    if (!event) { /* TODO: Show error and bail */ }
    console.log(event)
    let event_page = new EventPage(event)
    document.body.append(event_page.createEventInfo(event))
  })
})
