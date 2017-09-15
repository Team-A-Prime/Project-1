class EventsPage {
  createEventList(event_list) {
    let divGroup = document.createElement('div')
    if (event_list && event_list.length) {
      for (let i in event_list) {
        let divRow = document.createElement('div')

        let dateText = document.createElement('span')
        dateText.innerHTML = event_list[i].date

        let nameText = document.createElement('a')
        nameText.innerHTML = event_list[i].name
        nameText.href = '/event?id=' + event_list[i].uid

        divRow.appendChild(dateText)
        divRow.appendChild(nameText)
        divGroup.appendChild(divRow)
      }
    } else {
      let err = document.createElement('a')
      err.innerHTML = 'No Events'
      divGroup.appendChild(err)
    }
    return divGroup
  }
}

$(() => {
  fetch('/api/events/').then(res => res.json()).then(event_list => {
    let events_page = new EventsPage()
    $('.content_card')[0].appendChild(events_page.createEventList(event_list))
  })
})
