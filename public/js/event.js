class EventPage {
  getEventName(eventName) {
    let eventName = document.createElement('span')
    eventName.innerHTML = someEvent[i].name
    return eventName
  }

  getEventDate(eventDate) {
    let eventDate = document.createElement('span')s
    // TODO: Add Date parsing?
    eventDate.innerHTML = someEvent[i].date
    return eventDate
  }

  getEventTimeSlots(eventTimeArray) {
    let timeSlots = document.createElement('div')
    for (let i in eventTimeArray) {
      let timeSlot = document.createElement('span')
      timeSlot.innerHTML = formatTime(eventTimeArray, is24) // TODO: make formatTime function
      timeSlots.appendChild(timeSlot)
    }
    return timeSlots
  }

  getEventTimeOptions(eventTimeArray) {
    let timeOptions = document.createElement('div')
    for (let i in eventTimeArray) {
      let timeOption = document.createElement('span')
      //TODO: make options
      timeOptions.appendChild(timeOption)
    }
    return timeOptions
  }

  getEventInfo(someEvent) {
    let eventInfo = document.createElement('div')

    eventInfo.appendChild(getEventName(someEvent.name))
    eventInfo.appendChild(getEventDate(someEvent.date))
    eventInfo.appendChild(getEventTimeSlots(someEvent.time))
    eventInfo.appendChild(getEventTimeOptions(someEvent.time))

    return eventInfo
  }
}
