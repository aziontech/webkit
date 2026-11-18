import type { ProjectIntakeUpload } from './state-project-intake.vue'

export const sampleUploads: ProjectIntakeUpload[] = [
  { id: 'package.json', name: 'package.json', size: 1229, status: 'success' },
  { id: 'app.config.js', name: 'app.config.js', size: 640, status: 'success' },
  { id: 'src/index.ts', name: 'src/index.ts', size: 3482, status: 'running', progress: 60 },
  { id: 'src/routes/api.ts', name: 'src/routes/api.ts', size: 2150, status: 'pending' },
  { id: 'public/index.html', name: 'public/index.html', size: 860, status: 'pending' }
]

export const sampleFailedUploads: ProjectIntakeUpload[] = [
  { id: 'package.json', name: 'package.json', size: 1229, status: 'success' },
  { id: 'app.config.js', name: 'app.config.js', size: 640, status: 'success' },
  {
    id: 'src/index.ts',
    name: 'src/index.ts',
    size: 3482,
    status: 'error',
    progress: 60,
    error: 'The upload stopped. Check your connection and retry.'
  },
  { id: 'src/routes/api.ts', name: 'src/routes/api.ts', size: 2150, status: 'pending' },
  { id: 'public/index.html', name: 'public/index.html', size: 860, status: 'pending' }
]
