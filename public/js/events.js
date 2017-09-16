import $ from '/js/init.js'

export class EventsPage {
  constructor(event_list) {
    this.events = event_list.sort((e1, e2) => (new Date(e1.date)).getTime() - (new Date(e2.date)).getTime())
  }

  createEventList() {
    let divGroup = document.createElement('div')
    if (this.events && this.events.length) {
      for (let i in this.events) {
        let divRow = document.createElement('div')
        divRow.className = "row"

        let dateText = document.createElement('span')
        dateText.innerHTML = this.events[i].date

        let nameText = document.createElement('a')
        nameText.innerHTML = this.events[i].name
        nameText.href = '/event?id=' + this.events[i].uid

        let deleteButton = document.createElement('button')
        deleteButton.innerHTML = 'X'
        deleteButton.className = 'button is-danger is-small is-outlined'
        deleteButton.addEventListener('click', event => {
          if (!confirm("Are you sure you want to delete \'" + this.events[i].name + "\'?")) return
          fetch("/api/events/delete", {
            headers: {'Content-Type': 'application/json'},
            method: "POST",
            body: JSON.stringify({uid:this.events[i].uid})
          }).then(res => res.json()).then(res => {
            if (res.status != "ok") {
              alert("Could not contact server, please try again")
              return
            }
            window.location.reload()
          })
        })

        divRow.appendChild(dateText)
        divRow.appendChild(nameText)
        divRow.appendChild(deleteButton)
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
