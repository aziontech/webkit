<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
</script>

<template>
  <DropdownMenu>
    <DropdownMenu.Trigger>
      <Button
        variant="secondary"
        icon="az az-ellipsis"
        label="Actions"
      />
    </DropdownMenu.Trigger>

    <DropdownMenu.Group>
      <DropdownMenu.Item
        value="edit"
        label="Edit"
      />
      <DropdownMenu.Item
        value="duplicate"
        label="Duplicate"
      />
      <DropdownMenu.Sub default-open>
        <DropdownMenu.SubTrigger label="Move to">
          <template #leading>
            <i
              class="az az-folder"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Group label="Environments">
            <DropdownMenu.Item
              value="production"
              label="production"
            />
            <DropdownMenu.Item
              value="staging"
              label="staging"
            />
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger label="Other workspaces" />
              <DropdownMenu.SubContent>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="acme-store"
                    label="acme-store"
                  />
                  <DropdownMenu.Item
                    value="docs-site"
                    label="docs-site"
                  />
                </DropdownMenu.Group>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Group>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger
          label="Share"
          disabled
        />
        <DropdownMenu.SubContent>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="copy-link"
              label="Copy link"
            />
          </DropdownMenu.Group>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    </DropdownMenu.Group>

    <DropdownMenu.Group>
      <DropdownMenu.Item
        value="delete"
        label="Delete"
      />
    </DropdownMenu.Group>
  </DropdownMenu>
</template>
