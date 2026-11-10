export const REACH_SECTION = {
  _id: 'stats-band',
  props: {
    items: [
      { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
      { value: '24', suffix: '/7', label: 'Support on every plan' },
      { value: '99.99', suffix: '%', label: 'Availability, contractual' }
    ]
  }
}

export const PARTNERS_SECTION = {
  _id: 'stats-band',
  props: {
    items: [
      { prefix: '+', value: '100', label: 'Data centers worldwide' },
      { prefix: '+', value: '3k', label: 'ASNs directly connected to Azion' },
      { value: '100', suffix: '%', label: 'Availability, guaranteed by SLA' }
    ]
  }
}
