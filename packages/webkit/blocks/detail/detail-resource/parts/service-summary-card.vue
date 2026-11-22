<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import { serviceDomains as domains } from '../sample'
  import ServiceDeploymentSettings from './service-deployment-settings.vue'
  import SummaryFact from './summary-fact.vue'
  import SummaryFacts from './summary-facts.vue'
  import SummarySubjectBand from './summary-subject-band.vue'

  const environments = [{ name: 'Production' }, { name: 'Preview' }]
  const environment = defineModel<string>('environment', { required: true })

  const menu = [
    [{ value: 'copy-url', label: 'Copy URL', icon: 'az az-copy' }],
    [
      { value: 'manage-domains', label: 'Manage domains', icon: 'az az-globe' },
      { value: 'settings', label: 'Settings', icon: 'az az-settings' }
    ]
  ]

  const MENU_TRIGGER_CLASS =
    'flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) ' +
    'transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)'
</script>

<template>
  <Card :padded="false">
    <template #default>
      <SummarySubjectBand
        icon="az az-globe"
        label="service-01.example.com"
        href="https://service-01.example.com"
        visit="https://service-01.example.com"
        actions-label="Service actions"
        :menu="menu"
      >
        <template #subject-trailing>
          <Popover
            side="bottom"
            align="start"
            size="small"
          >
            <Popover.Trigger>
              <div class="shrink-0 cursor-pointer">
                <Tag
                  label="+7"
                  severity="neutral"
                  size="small"
                />
              </div>
            </Popover.Trigger>

            <Popover.Content>
              <div
                class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
              >
                <p class="text-label-sm text-(--text-muted)">8 domains</p>
              </div>

              <div
                class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
              >
                <Item
                  v-for="domain in domains"
                  :key="domain"
                  :href="`https://${domain}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="option"
                >
                  <span class="truncate">{{ domain }}</span>
                  <i
                    class="az az-external-link ms-auto shrink-0 text-body-xs leading-none"
                    aria-hidden="true"
                  />
                </Item>
              </div>

              <span
                class="sr-only"
                role="status"
                >8 domains</span
              >
            </Popover.Content>
          </Popover>
        </template>
        <template #actions>
          <div class="contents md:hidden">
            <Tooltip
              content="Select an environment to see its deployment and settings, or add another one"
            >
              <DropdownMenu
                side="bottom"
                align="end"
                @select="
                  (_event, value) => {
                    if (value !== '__add-environment__') environment = String(value)
                  }
                "
              >
                <DropdownMenu.Trigger>
                  <span :class="MENU_TRIGGER_CLASS">
                    <i
                      class="az az-layers shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ environment }}</span>
                    <i
                      class="az az-chevron-down shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                </DropdownMenu.Trigger>

                <DropdownMenu.Group label="Environments">
                  <DropdownMenu.Item
                    v-for="option in environments"
                    :key="option.name"
                    :value="option.name"
                    :label="option.name"
                    :selected="option.name === environment"
                  />
                </DropdownMenu.Group>

                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="__add-environment__"
                    label="Add Environment"
                  >
                    <template #leading>
                      <i
                        class="az az-plus"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu>
            </Tooltip>
          </div>
        </template>
      </SummarySubjectBand>

      <SummaryFacts columns="sm:grid-cols-4">
        <SummaryFact>
          <template #label>
            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
              <span class="text-label-sm text-(--text-muted)">Custom domains</span>
              <Tooltip content="Add a custom domain">
                <IconButton
                  icon="az az-circle-plus"
                  variant="ghost"
                  size="small"
                  aria-label="Add a custom domain"
                />
              </Tooltip>
            </span>
          </template>
          <span class="truncate text-body-sm text-(--text-muted)"> None </span>
        </SummaryFact>

        <SummaryFact
          label="Status"
          value-class=""
        >
          <StatusIndicator
            severity="success"
            label="Live"
          />
        </SummaryFact>

        <SummaryFact label="Service ID">
          <span class="truncate text-body-sm tabular-nums text-(--text-default)"> 1020655 </span>
          <CopyButton
            variant="outline"
            value="1020655"
            aria-label="Copy service ID"
            class="shrink-0"
            size="small"
          />
        </SummaryFact>

        <SummaryFact label="Created">
          <span class="truncate text-body-sm text-(--text-default)"> Sep 22 by Ethan Brooks </span>
          <Avatar
            alt="Ethan Brooks"
            label="Ethan Brooks"
            size="small"
            variant="square"
            class="shrink-0"
          />
        </SummaryFact>
      </SummaryFacts>

      <ServiceDeploymentSettings />
    </template>
  </Card>
</template>
