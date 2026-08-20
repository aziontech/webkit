// THE APPLICATION'S OPTIONAL REQUEST BODY — the seven `modules` flags and the two
// application-level behavior flags that POST /v4/workspace/applications accepts
// alongside the one field it requires (`name`).
//
// It lived inside the create page, which was fine while the create page was the only
// screen that asked about modules. It is not: the create wizard's Advanced disclosure
// asks (pages/applications/wizard/ConfigureStep.vue) and an application's Main Settings
// asks again (pages/applications/panels/MainSettings.vue). Same names, same order, same
// copy — or a created application reads differently the first time it is edited, which
// is the kind of drift that starts on the first module anybody adds.
//
// ── TWO TIERS, AND THE DIFFERENCE IS NOT COSMETIC ──
//
// `DEFAULT_MODULES` ship on every plan and are the reader's to toggle.
// `SUBSCRIPTION_MODULES` are paid add-ons that cannot be switched on from a form at
// all — activating one is a sales conversation. So their switch is disabled, a Tooltip
// says why, and the ROW carries the way forward (a real link), because a Tooltip panel
// is `pointer-events-none` and can never hold one.

/** Where an unactivatable module sends the reader. */
export const CONTACT_SALES = 'https://www.azion.com/en/contact-sales/'

/**
 * The modules the reader can turn on, in Main Settings' order. `key` indexes
 * `form.modules`, and is the API's own snake_case name — the form object IS the
 * request body, so the keys are not translated on the way out.
 */
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
    description: 'Activate DeviceAtlas variables to configure responsive rules.'
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

/** Paid add-ons: shown, explained, and not switchable from a form. */
export const SUBSCRIPTION_MODULES = [
  {
    key: 'web_socket_proxy',
    title: 'WebSocket Proxy',
    description:
      'Enhance real-time data exchange between your application and backend services using the WebSocket protocol.'
  }
]

/** The two application-level flags, in the order Main Settings lists them. */
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

/**
 * The `modules` defaults — the endpoint's OWN defaults, which is what licenses hiding
 * every one of them behind the create's Advanced disclosure: an untouched form sends
 * exactly what the API would have applied on its own.
 */
export const defaultModuleState = () => ({
  application_accelerator: false,
  cache: true,
  device_detection: false,
  functions: true,
  image_processor: false,
  load_balancer: false,
  web_socket_proxy: false
})
