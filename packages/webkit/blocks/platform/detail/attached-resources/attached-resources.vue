<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import DropdownRoot from '@aziontech/webkit/dropdown-root'
  import DropdownGroup from '@aziontech/webkit/dropdown-group'
  import DropdownOption from '@aziontech/webkit/dropdown-option'
  import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import TableBody from '@aziontech/webkit/table-body'
  import TableCell from '@aziontech/webkit/table-cell'
  import TableHeadCell from '@aziontech/webkit/table-head-cell'
  import TableHeader from '@aziontech/webkit/table-header'
  import TableRow from '@aziontech/webkit/table-row'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  const domains = [
    {
      id: 'generated',
      domain: 'web-app-7f3a.example.net',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Managed (free)',
      generated: true
    },
    {
      id: 'shop',
      domain: 'shop.example.com',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Managed (free)',
      generated: false
    },
    {
      id: 'preview',
      domain: 'preview.example.com',
      environment: 'Stage',
      policy: 'Versioned',
      certificate: '*.example.com',
      generated: false
    }
  ]

  const countLabel = computed(
    () => `${domains.length} ${domains.length === 1 ? 'domain' : 'domains'}`
  )
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <div class="flex min-w-0 flex-col">
        <TableRoot :border="false">
          <TableHeader>
            <TableRow>
              <TableHeadCell principal>Domain</TableHeadCell>
              <TableHeadCell>Environment</TableHeadCell>
              <TableHeadCell>Policy</TableHeadCell>
              <TableHeadCell>Certificate</TableHeadCell>
              <TableHeadCell kind="action" />
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="entry in domains"
              :key="entry.id"
            >
              <TableCell principal>{{ entry.domain }}</TableCell>
              <TableCell>
                <Tag
                  v-if="entry.environment"
                  severity="secondary"
                  size="medium"
                  rounded
                  icon="ai ai-layers"
                  :label="entry.environment"
                />
              </TableCell>
              <TableCell>
                <Tag
                  v-if="entry.environment"
                  severity="secondary"
                  size="medium"
                  rounded
                  :label="entry.policy"
                />
              </TableCell>
              <TableCell>
                <Tag
                  severity="secondary"
                  size="medium"
                  rounded
                  icon="pi pi-verified"
                  :label="entry.certificate"
                />
              </TableCell>
              <TableCell kind="action">
                <DropdownRoot
                  v-if="!entry.generated"
                  placement="bottom-end"
                >
                  <DropdownTrigger>
                    <Tooltip text="Row actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="small"
                        :aria-label="`Actions for ${entry.domain}`"
                      />
                    </Tooltip>
                  </DropdownTrigger>
                  <DropdownGroup>
                    <DropdownOption
                      value="edit"
                      label="Edit"
                    >
                      <template #left
                        ><i
                          class="pi pi-pencil"
                          aria-hidden="true"
                      /></template>
                    </DropdownOption>
                  </DropdownGroup>
                  <DropdownGroup>
                    <DropdownOption
                      value="delete"
                      label="Delete"
                    >
                      <template #left
                        ><i
                          class="pi pi-trash"
                          aria-hidden="true"
                      /></template>
                    </DropdownOption>
                  </DropdownGroup>
                </DropdownRoot>
              </TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>

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
          />
        </div>
      </div>
    </template>
  </CardBox>
</template>
