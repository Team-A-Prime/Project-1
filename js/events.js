class EventsPage {
  createEventList(event_list) {
    let divGroup = document.createElement('div')
    for (let i in event_list) {
      let divRow = document.createElement('div')

      let dateText = document.createElement('span')
      dateText.innerHTML = event_list[i].date

      let nameText = document.createElement('a')
      nameText.innerHTML = event_list[i].name
      nameText.href = '/event/' + event_list[i].id

      divRow.appendChild(dateText)
      divRow.appendChild(nameText)
      divGroup.appendChild(divRow)
    }
    return divGroup
  }
}

$(() => {
  let events_page = new EventsPage()
  // TODO: bailout early if list is emtpy
  $('.content_card')[0].appendChild(events_page.createEventList(/* TODO: backend response */))
})
