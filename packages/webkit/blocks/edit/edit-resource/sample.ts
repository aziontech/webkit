import type { EditResourceProject } from './edit-resource.vue'

export const sampleProject: EditResourceProject = {
  name: 'web-app',
  active: true,
  modules: {
    compression: true,
    caching: true,
    device_detection: false,
    custom_code: true,
    image_optimization: false,
    load_balancing: false,
    web_socket_proxy: false
  }
}

export const sampleProjectDraft: Partial<EditResourceProject> = {
  modules: { ...sampleProject.modules, device_detection: true }
}

export const sampleStaleProject: EditResourceProject = {
  ...sampleProject,
  modules: { ...sampleProject.modules, image_optimization: true }
}
