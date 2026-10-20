export const CONTACT_SALES = 'https://www.azion.com/en/contact-sales/'

export const DEFAULT_MODULES = [
  {
    key: 'application_accelerator',
    title: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.'
  },
  {
    key: 'cache',
    title: 'Cache',
    description: 'Customize advanced cache settings.'
  },
  {
    key: 'device_detection',
    title: 'Device Detection',
    description: 'Enable DeviceAtlas variables to configure responsive rules.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build ultra-low latency functions that run on Azion.'
  },
  {
    key: 'image_processor',
    title: 'Image Processor',
    description: 'Enable dynamic image editing options.'
  },
  {
    key: 'load_balancer',
    title: 'Load Balancer',
    description:
      'Balance traffic to your origins ensuring reliability and network congestion control.'
  }
]

export const SUBSCRIPTION_MODULES = [
  {
    key: 'web_socket_proxy',
    title: 'WebSocket Proxy',
    description:
      'Enhance real-time data exchange between your application and backend services using the WebSocket protocol.'
  }
]

export const APPLICATION_BEHAVIOR_FIELDS = [
  {
    key: 'active',
    title: 'Active',
    description: 'When disabled, the application is created but does not serve traffic.'
  },
  {
    key: 'debug',
    title: 'Debug',
    description: 'Expose executed rules in $traceback and $stacktrace.'
  }
]

export const defaultModuleState = () => ({
  application_accelerator: false,
  cache: true,
  device_detection: false,
  functions: true,
  image_processor: false,
  load_balancer: false,
  web_socket_proxy: false
})
