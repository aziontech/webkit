<script setup>
  // THE DOMAINS THIS WORKLOAD ANSWERS ON — the Settings tab's own list, and the only
  // surface that shows all of them at once.
  //
  // ── IT REPORTS; THE FORM DECIDES ──
  //
  // The certificate used to be a Select in every row, which split one domain's answers
  // across two surfaces: the address and the environment were answered in the drawer, and
  // how it is SERVED was answered here, in a control with no label, no hint, and no way to
  // say why one certificate is the right one. It is a field on the form now
  // (./AddEnvironmentDrawer.vue), defaulted from the address, and this table reports it
  // like every other fact in the row.
  //
  // So the row's controls are the two acts a list row owns — open it, or remove it — in
  // the row-actions menu every table in this console carries. A menu and not two icon
  // buttons because the action cell is 40px wide by contract (one control), and because
  // the reader already knows where a row's actions live.
  //
  // THE GENERATED ROW HAS NEITHER. It is the hostname the platform minted for this
  // workload: it cannot be renamed, moved, or removed, so it carries no menu rather than a
  // menu of disabled rows.
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

  // Composition-mode columns size themselves, and every row is its own flex container —
  // so the header and the body have to carry the SAME style or the two drift apart
  // (../../lib/behavior/table-columns.js). The three bounded columns take a fixed basis
  // built from the shared ladder; the domain is the one open-ended column, so it is the
  // only one on a share and the only one that truncates.
  const DOMAIN_COLUMN = { flex: '2 1 0' }
  const ENVIRONMENT_COLUMN = { flex: `0 0 ${TAG_COLUMN_WIDE}px` }
  const POLICY_COLUMN = { flex: `0 0 ${TAG_COLUMN}px` }
  // The certificate is a NAME now rather than a Select, so it no longer needs the width a
  // trigger did — but it is still the longest of the bounded columns, and a name that
  // truncates to `edgeflow.com wild…` is the one fact here nobody can reconstruct.
  const CERTIFICATE_COLUMN = { flex: '0 0 200px' }

  const props = defineProps({
    /**
     * The domains this workload answers on — `{ id, domain, environment, certificate,
     * generated }`. A generated row is the hostname the platform minted: it is served by
     * the free Azion certificate and cannot be edited or removed.
     */
    domains: { type: Array, default: () => [] },
    /** Locks every control while the page's commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['add', 'edit', 'remove'])

  const certificateLabel = (id) => domainCertificateLabel(id)

  const policyLabel = (environment) =>
    environment ? deploymentPolicyLabel(policyForEnvironment(environment)) : ''

  const countLabel = computed(
    () => `${props.domains.length} ${props.domains.length === 1 ? 'domain' : 'domains'}`
  )

  // The Dropdown emits `(event, value)` — the console's activation shape. The row travels
  // with the handler rather than through a selected-row ref, so two menus can never
  // disagree about which row is armed.
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
              <Table.Cell :style="ENVIRONMENT_COLUMN">{{ entry.environment }}</Table.Cell>
              <Table.Cell :style="POLICY_COLUMN">
                <Tag
                  v-if="entry.environment"
                  severity="secondary"
                  size="small"
                  :label="policyLabel(entry.environment)"
                />
              </Table.Cell>
              <!-- The generated row's certificate is MUTED, the rest are not: it is the
                   one value on this table nobody chose and nobody can change. -->
              <Table.Cell :style="CERTIFICATE_COLUMN">
                <span
                  class="min-w-0 truncate"
                  :class="entry.generated ? 'text-(--text-muted)' : 'text-(--text-default)'"
                >
                  {{ certificateLabel(entry.certificate) }}
                </span>
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
