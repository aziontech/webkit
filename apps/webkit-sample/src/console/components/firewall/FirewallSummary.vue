<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { applicationIdByName } from '../../lib/data/applications'
  import { FIREWALL_MODULE_FIELDS } from '../../lib/data/firewalls'
  import { relativeTime } from '../../lib/format/relative-time'
  import ResourceLink from '../resource/ResourceLink.vue'
  import SummaryBand from '../resource/SummaryBand.vue'

  const props = defineProps({
    /** The record this page is about — `{ id, name, status, modules, rules, environment, application }`. */
    firewall: { type: Object, required: true },
    /** Carried on the application link so the demo keeps the signed-in email. */
    email: { type: String, default: '' },
    /** Where the footer's documentation control points. */
    documentationHref: {
      type: String,
      default: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/'
    }
  })

  const emit = defineEmits([
    /** The reader asked for the rules this firewall runs. */
    'rules',
    /** The reader asked for the firewall's own record. */
    'settings'
  ])

  const application = computed(() => props.firewall.application || '')
  const applicationId = computed(() => applicationIdByName(application.value))
  const applicationRoute = computed(() =>
    applicationId.value
      ? { path: `/applications/${applicationId.value}`, query: { email: props.email || undefined } }
      : null
  )

  const active = computed(() => props.firewall.status !== 'Inactive')
  const ruleCount = computed(() => Number(props.firewall.rules ?? 0))
  const ruleLabel = computed(() => `${ruleCount.value} ${ruleCount.value === 1 ? 'rule' : 'rules'}`)

  const enabled = computed(() => {
    const keys = props.firewall.modules ?? []
    return FIREWALL_MODULE_FIELDS.filter((field) => field.locked || keys.includes(field.key))
  })

  const inspecting = computed(() =>
    enabled.value.filter((field) => field.key !== 'ddos').map((field) => field.title)
  )

  const inspectingSentence = computed(() => {
    const names = inspecting.value
    if (!names.length) return 'DDoS Protection'
    if (names.length === 1) return `DDoS Protection and ${names[0]}`
    return `DDoS Protection, ${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
  })

  const inspectingVerb = computed(() => (inspecting.value.length ? 'inspect' : 'inspects'))

  const editedAgo = computed(() => relativeTime(props.firewall.modifiedAt))

  const copyId = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(String(props.firewall.id))
      toast.success('ID copied.')
    } catch {
      toast.error('Could not copy the ID.')
    }
  }

  const onAction = (value) => {
    if (value === 'copy-id') return copyId()
    if (value === 'settings') return emit('settings')
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <SummaryBand kind="subject">
        <div class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)">
          <i
            class="ai ai-edge-application shrink-0 text-[1.15em] text-(--text-muted)"
            aria-hidden="true"
          />
          <ResourceLink
            v-if="applicationRoute"
            :label="application"
            :to="applicationRoute"
            module="Applications"
          />
          <span
            v-else-if="application"
            class="truncate text-body-sm text-(--text-default)"
          >
            {{ application }}
          </span>
          <span
            v-else
            class="truncate text-body-sm text-(--text-disabled)"
          >
            Not bound to an application
          </span>
        </div>

        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Rules Engine"
            kind="secondary"
            size="medium"
            icon="pi pi-sort-alt"
            @click="emit('rules')"
          />

          <Dropdown
            placement="bottom-end"
            @select="(event, value) => onAction(value)"
          >
            <Dropdown.Trigger>
              <Tooltip text="Firewall actions">
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="outlined"
                  size="medium"
                  aria-label="Firewall actions"
                />
              </Tooltip>
            </Dropdown.Trigger>

            <Dropdown.Group>
              <Dropdown.Option
                value="copy-id"
                label="Copy ID"
              >
                <template #left>
                  <i
                    class="pi pi-copy"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>

            <Dropdown.Group>
              <Dropdown.Option
                value="settings"
                label="Settings"
              >
                <template #left>
                  <i
                    class="pi pi-cog"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>
      </SummaryBand>

      <SummaryBand
        kind="facts"
        class="grid grid-cols-2 gap-(--spacing-sm) lg:grid-cols-4"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Status</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <StatusIndicator
              :severity="active ? 'success' : 'neutral'"
              :label="active ? 'Active' : 'Inactive'"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Environment</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <Tag
              v-if="firewall.environment"
              :label="firewall.environment"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
            <span
              v-else
              class="truncate text-body-sm text-(--text-disabled)"
            >
              —
            </span>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Rules</span>
          <div class="flex min-h-7 min-w-0 items-center">
            <button
              type="button"
              class="truncate rounded-(--shape-button) text-body-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              @click="emit('rules')"
            >
              {{ ruleLabel }}
            </button>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-label-sm text-(--text-muted)">Last Modified</span>
          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
            <template v-if="firewall.author">
              <span class="truncate text-body-sm text-(--text-default)">
                {{ editedAgo }} by {{ firewall.author }}
              </span>
              <Avatar
                :src="firewall.authorAvatar || undefined"
                :alt="firewall.author"
                :label="firewall.author"
                size="small"
                kind="square"
                class="shrink-0"
              />
            </template>
            <span
              v-else
              class="truncate text-body-sm text-(--text-disabled)"
            >
              —
            </span>
          </div>
        </div>

        <div class="col-span-2 flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-4">
          <span class="text-label-sm text-(--text-muted)">Modules</span>
          <div class="flex min-h-7 min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              v-for="field in enabled"
              :key="field.key"
              :label="field.title"
              severity="secondary"
              size="small"
              class="shrink-0"
            />
          </div>
        </div>
      </SummaryBand>

      <SummaryBand kind="state">
        <p
          class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
        >
          <template v-if="active">
            {{ inspectingSentence }} {{ inspectingVerb }} every request before it reaches
            <template v-if="application">{{ application }}</template>
            <template v-else>the application behind this firewall</template>. The rules run in
            order, and the first one that refuses a request ends it.
          </template>
          <template v-else>
            This firewall is inactive, so none of its rules are evaluated and nothing it would
            block is blocked. Switch it on under Settings.
          </template>
        </p>

        <Button
          class="w-full shrink-0 @lg/band:ml-auto @lg/band:w-auto"
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="pi pi-book"
          :href="documentationHref"
          target="_blank"
        />
      </SummaryBand>
    </template>
  </CardBox>
</template>
