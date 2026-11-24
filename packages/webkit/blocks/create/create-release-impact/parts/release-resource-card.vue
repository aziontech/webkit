<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import {
    dependencyCount,
    LATEST,
    resolvedVersion,
    resourceTypes,
    versionLabel
  } from '../lib/release-impact'
  import type { ReleaseImpactResource } from '../types'

  export interface ReleaseResourceCardProps {
    /** A deploy is running: the controls lock. */
    deploying?: boolean
  }

  withDefaults(defineProps<ReleaseResourceCardProps>(), { deploying: false })

  /** The resource, its inclusion and the version it deploys at. */
  const card = defineModel<ReleaseImpactResource>('card', { required: true })

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <Card
    :padded="false"
    :aria-label="`${resourceTypes[card.type].label} ${card.name}`"
    :data-included="card.enabled || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            :class="resourceTypes[card.type].icon"
            class="shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-(--text-default)">
            {{ resourceTypes[card.type].label }}
          </span>
        </span>
        <span class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Tag
            key="tag-1"
            v-if="card.readonly"
            label="Read-only"
            severity="neutral"
            icon="az az-lock"
            size="small"
          />
          <Tag
            key="tag-2"
            v-else-if="card.required"
            label="Required"
            severity="warning"
            size="small"
          />
          <Tooltip
            v-if="card.canToggle"
            :content="
              card.enabled
                ? `Leave ${card.name} out of this release`
                : `Include ${card.name} in this release`
            "
          >
            <Switch
              v-model="card.enabled"
              :disabled="deploying"
              :aria-label="`Include ${card.name} in this release`"
            />
          </Tooltip>
        </span>
      </div>
    </template>
    <template #default>
      <p
        v-if="!card.enabled"
        class="p-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        {{ card.note }}
      </p>

      <div
        v-else
        class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md)"
      >
        <p
          v-if="card.readonly"
          class="text-body-sm text-(--text-muted)"
        >
          Kept from the active release.
        </p>

        <div class="grid min-w-0 gap-(--spacing-sm) sm:grid-cols-2">
          <Field>
            <Field.Label>Resource</Field.Label>
            <Input
              :model-value="card.name"
              size="medium"
              readonly
            />
          </Field>

          <Field :invalid="!card.versions.length">
            <Field.Label>Version</Field.Label>
            <Select
              v-model="card.versionId"
              size="medium"
              placeholder="Select a version"
              :disabled="deploying || card.readonly || !card.versions.length"
              :invalid="!card.versions.length"
              :display-value="(value) => versionLabel(card, value)"
            >
              <Select.Trigger class="w-full" />
              <Select.Content>
                <Select.Item
                  :value="LATEST"
                  icon="az az-sync"
                >
                  Track latest Ready
                  <template #tag>
                    <span class="shrink-0 text-body-xs text-(--text-muted)">
                      resolves at deploy
                    </span>
                  </template>
                </Select.Item>
                <Select.Group label="Pin a ready version">
                  <Select.Item
                    v-for="version in card.versions"
                    :key="version.id"
                    :value="version.id"
                  >
                    {{ version.id }}
                    <template #tag>
                      <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                        <Tag
                          v-if="version.current"
                          label="Current"
                          severity="success"
                          size="small"
                        />
                        <span class="text-body-xs text-(--text-muted)">
                          {{ ago(version.builtAt) }}
                        </span>
                      </span>
                    </template>
                  </Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
            <Field.Error v-if="!card.versions.length">
              {{ card.name }} has no Ready version, so it cannot be deployed.
            </Field.Error>
            <Field.Description v-else-if="card.versionId === LATEST">
              Resolves to {{ resolvedVersion(card) }} when the release deploys.
            </Field.Description>
          </Field>
        </div>

        <Button
          v-if="!card.versions.length"
          class="self-start"
          label="Build a version"
          variant="ghost"
          size="small"
          icon="az az-external-link"
          href="/services/edge-policy/versions"
        />

        <div
          v-if="card.groups.length"
          class="flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default)"
        >
          <div
            class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <h3 class="truncate text-label-md text-(--text-default)">Dependencies</h3>
            <Badge
              :label="String(dependencyCount(card))"
              variant="secondary"
              size="small"
            />
          </div>
          <Accordion
            type="multiple"
            size="medium"
            :default-value="card.groups.map((group) => group.type)"
          >
            <Accordion.Item
              v-for="group in card.groups"
              :key="group.type"
              :value="group.type"
            >
              <Accordion.Trigger>
                <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                  <i
                    :class="resourceTypes[group.type].icon"
                    class="shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ resourceTypes[group.type].label }}
                  </span>
                  <Badge
                    :label="String(group.rows.length)"
                    variant="secondary"
                    size="small"
                  />
                </span>
              </Accordion.Trigger>
              <Accordion.Content>
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <Alert
                    v-if="group.rows.some((row) => row.sharedWith?.length)"
                    severity="info"
                    size="small"
                    label="A shared dependency deploys at one version. Changing it here changes it under every resource in this release that references it."
                  />
                  <div
                    v-for="row in group.rows"
                    :key="row.name"
                    class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-muted) p-(--spacing-sm)"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-sm text-(--text-default)">
                        {{ row.name }}
                      </span>
                      <Tooltip
                        v-if="row.sharedWith?.length"
                        :content="`Also referenced by ${row.sharedWith.join(' and ')}.`"
                      >
                        <span
                          tabindex="0"
                          class="inline-flex shrink-0 rounded-(--shape-control) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                        >
                          <Tag
                            label="Shared"
                            severity="info"
                            icon="az az-link"
                            size="small"
                          />
                        </span>
                      </Tooltip>
                    </div>
                    <Select
                      v-model="row.versionId"
                      size="medium"
                      :disabled="deploying"
                      :display-value="(value) => versionLabel(row, value)"
                    >
                      <Select.Trigger
                        class="w-full"
                        :aria-label="`Version of ${row.name}`"
                      />
                      <Select.Content>
                        <Select.Item
                          :value="LATEST"
                          icon="az az-sync"
                        >
                          Track latest Ready
                        </Select.Item>
                        <Select.Group label="Pin a ready version">
                          <Select.Item
                            v-for="version in row.versions"
                            :key="version.id"
                            :value="version.id"
                          >
                            {{ version.id }}
                            <template #tag>
                              <span class="flex shrink-0 items-center gap-(--spacing-xs)">
                                <Tag
                                  v-if="version.current"
                                  label="Current"
                                  severity="success"
                                  size="small"
                                />
                                <span class="text-body-xs text-(--text-muted)">
                                  {{ ago(version.builtAt) }}
                                </span>
                              </span>
                            </template>
                          </Select.Item>
                        </Select.Group>
                      </Select.Content>
                    </Select>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </template>
  </Card>
</template>
