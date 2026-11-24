const illustrationDefaultFrame = { width: 592, height: 300 } as const

const frames: Record<string, readonly [number, number]> = {
  'ai-gateway': [272, 295],
  'api-endpoints': [960.36, 486.67],
  'azion-highlight': [170, 128],
  'azion-rest-api': [366, 176],
  branches: [170, 128],
  'chat-and-headset-tiles': [230, 154],
  'content-and-media-delivery-globe': [624.66, 316.55],
  'content-and-media-delivery': [583.23, 295.56],
  'ddos-protection': [186, 286],
  'distributed-apis-tile': [414, 148],
  'infrastructure-as-code': [667, 338],
  'no-idle-no-waste': [230, 154],
  'personal-tokens': [170, 128],
  'quick-start-with-templates': [360, 165],
  'real-time-metrics-error-rate': [366, 193],
  'real-time-metrics-status-codes': [366, 250],
  'request-inspection': [754.25, 382.22],
  'traffic-and-cost-bar-chart': [230, 154],
  'usage-chart': [170, 128]
}

export function illustrationFrame(name: string): { width: number; height: number } {
  const frame = Object.hasOwn(frames, name) ? frames[name] : null
  return frame ? { width: frame[0], height: frame[1] } : illustrationDefaultFrame
}
