export const LABELS = [
  '13:05',
  '13:10',
  '13:15',
  '13:20',
  '13:25',
  '13:30',
  '13:35',
  '13:40',
  '13:45',
  '13:50',
  '13:55',
  '14:00'
]

export const THREATS_VS_REQUESTS = [
  {
    id: 'allowed',
    name: 'WAF requests allowed',
    color: 'success',
    values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
  },
  {
    id: 'blocked',
    name: 'WAF requests blocked',
    color: 'danger',
    values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
  },
  {
    id: 'threat',
    name: 'WAF requests threat',
    color: 'warning',
    values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
  }
]

export const XSS_THREATS = [
  {
    id: 'xss',
    name: 'WAF requests XSS attacks',
    values: [42, 38, 51, 47, 63, 58, 72, 69, 81, 77, 90, 86]
  }
]

export const HOSTS = [
  ['www.example.com', [410, 430, 455, 470, 520, 540, 580, 600, 640, 660, 700, 720]],
  ['api.example.com', [300, 310, 290, 330, 350, 340, 370, 390, 380, 410, 430, 420]],
  ['shop.example.com', [220, 240, 260, 250, 270, 300, 290, 310, 330, 320, 350, 360]],
  ['docs.example.com', [150, 160, 155, 170, 180, 175, 190, 200, 210, 205, 220, 230]],
  ['status.example.com', [90, 95, 100, 110, 105, 115, 120, 125, 130, 128, 135, 140]],
  ['cdn.example.com', [60, 65, 62, 70, 72, 75, 80, 78, 85, 88, 90, 92]],
  ['blog.example.com', [30, 32, 35, 33, 36, 38, 40, 42, 41, 44, 46, 48]],
  ['auth.example.com', [20, 22, 21, 24, 25, 23, 26, 28, 27, 29, 30, 31]]
].map(([name, values]) => ({ id: name, name, values }))

export const COUNTRIES = [
  ['Brazil', 48210],
  ['United States', 31620],
  ['Germany', 18930],
  ['India', 12480],
  ['Netherlands', 9370],
  ['Singapore', 6120],
  ['France', 4410],
  ['Japan', 2980]
]

export const COUNTRY_SLICES = COUNTRIES.slice(0, 6).map(([name, value]) => ({
  id: name,
  name,
  values: [value]
}))

export const COUNTRY_LABELS = COUNTRIES.map(([name]) => name)

export const COUNTRY_BARS = [
  { id: 'blocked', name: 'Blocked threats', values: COUNTRIES.map(([, value]) => value) }
]

export const BLOCKED_TREND = [310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]

export const declare = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`
