class Calendar {
  // Generates times of the day in increments of 30 minutes
  static time_slots(is24) {
    return Array.from({length: 48}, (_, i) => {
      let hour = Math.floor(i/2)
      let min = ('0'+(30*(i%2))).slice(-2)
      return (is24) ? hour+':'+min : ((hour%12)||12)+':'+min+(hour<12?' AM':' PM')
    })
  }
}
