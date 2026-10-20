<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { TAG_COLUMN, TAG_COLUMN_WIDE } from '../../lib/behavior/table-columns'
  import { domainCertificateLabel } from '../../lib/data/certificates'
  import { deploymentPolicyLabel, policyForEnvironment } from '../../lib/data/environments'

  const DOMAIN_COLUMN = { flex: '2 1 0' }
  const ENVIRONMENT_COLUMN = { flex: `0 0 ${TAG_COLUMN_WIDE}px` }
  const POLICY_COLUMN = { flex: `0 0 ${TAG_COLUMN}px` }
  const CERTIFICATE_COLUMN = { flex: '0 0 200px' }

  interface Props {
    domains?: unknown[]
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    domains: () => [],
    disabled: false
  })

  const emit = defineEmits<{
    add: []
    edit: [id: unknown]
    remove: [id: unknown]
  }>()

  const certificateLabel = (id) => domainCertificateLabel(id)

  const policyLabel = (environment) =>
    environment ? deploymentPolicyLabel(policyForEnvironment(environment)) : ''

  const countLabel = computed(
    () => `${props.domains.length} ${props.domains.length === 1 ? 'domain' : 'domains'}`
  )

  const onRowAction = (value, entry) => {
    if (value === 'edit') emit('edit', entry.id)
    if (value === 'delete') emit('remove', entry.id)
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <div class="flex min-w-0 flex-col">
        <Table :border="false">
          <Table.Header>
            <Table.Row>
              <Table.HeadCell
                principal
                :style="DOMAIN_COLUMN"
                >Domain</Table.HeadCell
              >
              <Table.HeadCell :style="ENVIRONMENT_COLUMN">Environment</Table.HeadCell>
              <Table.HeadCell :style="POLICY_COLUMN">Policy</Table.HeadCell>
              <Table.HeadCell :style="CERTIFICATE_COLUMN">Certificate</Table.HeadCell>
              <Table.HeadCell kind="action" />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row
              v-for="entry in domains"
              :key="entry.id"
            >
              <Table.Cell
                principal
                :style="DOMAIN_COLUMN"
                >{{ entry.domain }}</Table.Cell
              >
              <Table.Cell :style="ENVIRONMENT_COLUMN">
                <Tag
                  v-if="entry.environment"
                  severity="secondary"
                  size="medium"
                  rounded
                  icon="ai ai-layers"
                  :label="entry.environment"
                />
              </Table.Cell>
              <Table.Cell :style="POLICY_COLUMN">
                <Tag
                  v-if="entry.environment"
                  severity="secondary"
                  size="medium"
                  rounded
                  :label="policyLabel(entry.environment)"
                />
              </Table.Cell>
              <Table.Cell :style="CERTIFICATE_COLUMN">
                <Tag
                  severity="secondary"
                  size="medium"
                  rounded
                  icon="pi pi-verified"
                  :label="certificateLabel(entry.certificate)"
                />
              </Table.Cell>
              <Table.Cell kind="action">
                <Dropdown
                  v-if="!entry.generated"
                  placement="bottom-end"
                  @select="(event, value) => onRowAction(value, entry)"
                >
                  <Dropdown.Trigger>
                    <Tooltip text="Row actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        :disabled="props.disabled"
                        :aria-label="`Actions for ${entry.domain}`"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="edit"
                      label="Edit"
                    >
                      <template #left
                        ><i
                          class="pi pi-pencil"
                          aria-hidden="true"
                      /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="delete"
                      label="Delete"
                    >
                      <template #left
                        ><i
                          class="pi pi-trash"
                          aria-hidden="true"
                      /></template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <div
          class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-body-xs text-(--text-muted)">{{ countLabel }}</span>
          <Button
            type="button"
            label="Add Domain"
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
            :disabled="props.disabled"
            @click="emit('add')"
          />
        </div>
      </div>
    </template>
  </CardBox>
</template>
