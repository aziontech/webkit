<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import {
    type DeployableDomainRow,
    sampleDeployableDomainColumns as domainColumns
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const emit = defineEmits<{
    remove: [event: Event, row: DeployableDomainRow]
  }>()

  const { saving, domains } = useDeployableSettingsContext()

  const onDomainAction = (event: Event, value: string | number, row: DeployableDomainRow) => {
    if (value === 'delete') emit('remove', event, row)
  }
</script>

<template>
  <SettingsGroup
    label="Domains"
    hint="The addresses this resource answers on, the environment each one answers in, and the certificate it is served with."
    anchor="domains"
  >
    <Card :padded="false">
      <template #default>
        <div class="flex min-w-0 flex-col">
          <DataTable
            :data="domains"
            :columns="domainColumns"
            row-key="id"
            :bordered="false"
          >
            <template #cell-environment="{ value }">
              <Tag
                v-if="value"
                severity="neutral"
                size="medium"
                rounded
                icon="az az-layers"
                :label="value"
              />
            </template>
            <template #cell-policy="{ row, value }">
              <template v-if="row.environment">{{ value }}</template>
            </template>
            <template #cell-certificate="{ value }">
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <i
                  class="az az-verified shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 truncate">{{ value }}</span>
              </span>
            </template>
            <template #cell-actions="{ row }">
              <DropdownMenu
                v-if="!row.generated"
                side="bottom"
                align="end"
                @select="(event, value) => onDomainAction(event, value, row)"
              >
                <DropdownMenu.Trigger>
                  <Tooltip content="Row actions">
                    <IconButton
                      icon="az az-ellipsis"
                      variant="outline"
                      size="small"
                      :disabled="saving"
                      :aria-label="`Actions for ${row.domain}`"
                    />
                  </Tooltip>
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="edit"
                    label="Edit"
                  >
                    <template #leading
                      ><i
                        class="az az-pencil"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="delete"
                    label="Delete"
                  >
                    <template #leading
                      ><i
                        class="az az-trash"
                        aria-hidden="true"
                    /></template>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu>
            </template>
          </DataTable>

          <div
            class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
          >
            <span class="text-body-xs text-(--text-muted)"
              >{{ domains.length }} {{ domains.length === 1 ? 'domain' : 'domains' }}</span
            >
            <Button
              type="button"
              label="Add domain"
              variant="outline"
              size="medium"
              icon="az az-plus"
              :disabled="saving"
            />
          </div>
        </div>
      </template>
    </Card>
  </SettingsGroup>
</template>
