<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Item from '@aziontech/webkit/item'

  export interface SignedInAsProps {
    /** The account that is signed in. */
    account: { name: string; initials: string; email: string }
    /** Switch account is not available, while an answer is in flight or after it. */
    disabled?: boolean
  }

  withDefaults(defineProps<SignedInAsProps>(), { disabled: false })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <h2 class="text-label-md text-(--text-muted)">Signed in as</h2>
    <Item
      variant="outline"
      size="small"
    >
      <Item.Media>
        <Avatar
          :label="account.initials"
          size="medium"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title class="max-w-full">
          <span
            class="min-w-0 truncate"
            :title="account.name"
            >{{ account.name }}</span
          >
        </Item.Title>
        <Item.Description>
          <span class="block wrap-anywhere">{{ account.email }}</span>
        </Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Switch account"
          variant="outline"
          size="small"
          href="/login?prompt=select_account"
          :disabled="disabled"
        />
      </Item.Actions>
    </Item>
  </div>
</template>
