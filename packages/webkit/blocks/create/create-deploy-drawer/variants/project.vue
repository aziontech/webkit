<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'
  import DeployResourcesCard from '../parts/deploy-resources-card.vue'

  interface Version {
    id: string
    name: string
    author: string
    createdAgo: string
    active?: boolean
  }
  interface Dependency {
    key: string
    label: string
    name: string
    icon: string
    note: string
    total: number
    versions: Version[]
  }
  interface Resource extends Dependency {
    owner: boolean
    dependencies: Dependency[]
  }

  const resources: Resource[] = [
    {
      key: 'service',
      label: 'Service',
      name: 'project-01-web',
      icon: 'az az-server',
      note: '',
      total: 12,
      versions: [
        {
          id: 'AWPT11GA',
          name: 'AWPT11GA',
          author: 'Taylor Reed',
          createdAgo: '21 hours ago',
          active: true
        },
        {
          id: 'AY3MQWWR',
          name: 'AY3MQWWR',
          author: 'John Smith',
          createdAgo: '2 days ago'
        },
        {
          id: 'AZHGGSD8',
          name: 'AZHGGSD8',
          author: 'Sam Lee',
          createdAgo: '4 days ago'
        },
        {
          id: 'A1VA6NTP',
          name: 'A1VA6NTP',
          author: 'Priya Patel',
          createdAgo: '4 days ago'
        },
        {
          id: 'A393WJA6',
          name: 'A393WJA6',
          author: 'Chris Taylor',
          createdAgo: '6 days ago'
        }
      ],
      owner: true,
      dependencies: [
        {
          key: 'service@AWPT11GA:module-image-optimizer',
          label: 'Module',
          name: 'image-optimizer',
          icon: 'az az-code',
          note: '',
          total: 6,
          versions: [
            {
              id: 'ATNSEE8Y',
              name: 'ATNSEE8Y',
              author: 'Taylor Reed',
              createdAgo: '2 days ago'
            },
            {
              id: 'AV1M49PF',
              name: 'AV1M49PF',
              author: 'John Smith',
              createdAgo: '3 days ago'
            },
            {
              id: 'AWFFU55W',
              name: 'AWFFU55W',
              author: 'Sam Lee',
              createdAgo: '4 days ago'
            },
            {
              id: 'AXT9K0MD',
              name: 'AXT9K0MD',
              author: 'Priya Patel',
              createdAgo: '6 days ago'
            },
            {
              id: 'AZ739W2U',
              name: 'AZ739W2U',
              author: 'Chris Taylor',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AWPT11GA:integration-search-index',
          label: 'Integration',
          name: 'search-index',
          icon: 'az az-link',
          note: '',
          total: 3,
          versions: [
            {
              id: 'AHMVCHSJ',
              name: 'AHMVCHSJ',
              author: 'John Smith',
              createdAgo: '2 days ago'
            },
            {
              id: 'AJ0P2D90',
              name: 'AJ0P2D90',
              author: 'Sam Lee',
              createdAgo: '4 days ago'
            },
            {
              id: 'AKEIS8PH',
              name: 'AKEIS8PH',
              author: 'Priya Patel',
              createdAgo: '4 days ago'
            }
          ]
        }
      ]
    },
    {
      key: 'storage',
      label: 'Storage',
      name: 'project-01-storage',
      icon: 'az az-database',
      note: 'Not versioned',
      total: 0,
      versions: [],
      owner: false,
      dependencies: []
    }
  ]

  const environmentChoices = [
    {
      name: 'Production',
      description: 'Live traffic. One version serves the domain, and deploying replaces it.',
      tag: 'Last used',
      setting: { name: 'shared-storefront', shared: true, projects: ['project-05', 'project-09'] }
    },
    {
      name: 'Preview',
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
      tag: '',
      setting: { name: 'project-01-preview', shared: false, projects: [] }
    }
  ]

  const open = ref(false)
  const picks = ref<Record<string, string>>({})
  const environment = ref('Production')

  const setting = computed(
    () =>
      (
        environmentChoices.find((entry) => entry.name === environment.value) ??
        environmentChoices[0]
      ).setting
  )

  const sharedWith = computed(() => (setting.value.shared ? setting.value.projects : []))

  watch(open, (isOpen) => {
    if (!isOpen) return
    picks.value = {}
    environment.value = 'Production'
  })
</script>

<template>
  <DeployDrawerFrame
    v-model:open="open"
    description="Deploy project-01. Review what goes live and where."
  >
    <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
      <legend class="sr-only">Deploy</legend>
      <SettingsGroup
        label="Resources"
        hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
      >
        <DeployResourcesCard
          v-model:picks="picks"
          :resources="resources"
        />
      </SettingsGroup>

      <SettingsGroup
        label="Environment"
        hint="Where the deployment goes live. Each environment goes live with its own Deployment Settings."
      >
        <RadioGroup
          v-model="environment"
          variant="card"
          name="project-deploy-environment"
          aria-label="Environment"
        >
          <RadioGroup.Item
            v-for="entry in environmentChoices"
            :key="entry.name"
            :value="entry.name"
            :description="entry.description"
          >
            {{ entry.name }}
            <template
              v-if="entry.tag"
              #tag
            >
              <Tag
                :label="entry.tag"
                severity="info"
                size="small"
              />
            </template>
          </RadioGroup.Item>
        </RadioGroup>

        <Alert
          v-if="sharedWith.length"
          severity="warning"
          size="small"
          :label="`Deploying with ${setting.name} also deploys to ${sharedWith.join(', ')}.`"
        />
      </SettingsGroup>
    </fieldset>
  </DeployDrawerFrame>
</template>
