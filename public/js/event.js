class EventPage {
  constructor(event) {
    this.event = event
  }

  getEventName() {
    let eventName = document.createElement('span')
    eventName.innerHTML = this.event.name
    return eventName
  }

  getEventDate() {
    let eventDate = document.createElement('span')
    // TODO: Add Date parsing?
    eventDate.innerHTML = this.event.date
    return eventDate
  }

  getEventTimeSlots() {
    let timeSlots = document.createElement('div')
    for (let i in this.event.times) {
      let timeSlot = document.createElement('span')
      timeSlot.innerHTML = this.event.times[i] // TODO: make formatTime function
      timeSlots.appendChild(timeSlot)
    }
    return timeSlots
  }

  getEventTimeOptions() {
    let timeOptions = document.createElement('div')
    for (let i in this.event.times) {
      let timeOption = document.createElement('span')
      //TODO: make options
      timeOptions.appendChild(timeOption)
    }
    return timeOptions
  }

  getEventInfo() {
    let eventInfo = document.createElement('div')

    eventInfo.appendChild(this.getEventName())
    eventInfo.appendChild(this.getEventDate())
    eventInfo.appendChild(this.getEventTimeSlots())
    eventInfo.appendChild(this.getEventTimeOptions())

    return eventInfo
  }
}

$(() => {
  let event_id = (new URLSearchParams(window.location.search)).get('id')
  fetch('/api/events/?uid='+event_id).then(res => res.json()).then(event => {
    if (!event) { /* TODO: Show error and bail */ }
    let event_page = new EventPage(event)
    document.body.append(event_page.getEventInfo(event))
  })
})
