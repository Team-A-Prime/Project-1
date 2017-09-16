class EventsPage {
  constructor(event_list) {
    this.events = event_list.sort((e1, e2) => (new Date(e1.date)).getTime() - (new Date(e2.date)).getTime())
  }

  createEventList() {
    let divGroup = document.createElement('div')
    if (this.events && this.events.length) {
      for (let i in this.events) {
        let divRow = document.createElement('div')

        let dateText = document.createElement('span')
        dateText.innerHTML = this.events[i].date

        let nameText = document.createElement('a')
        nameText.innerHTML = this.events[i].name
        nameText.href = '/event?id=' + this.events[i].uid

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
    let events_page = new EventsPage(event_list)
    $('.content_card')[0].appendChild(events_page.createEventList())
  })
})
