<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import Item from '@aziontech/ui/item'
  import Tag from '@aziontech/ui/tag'
  import { toast } from '@aziontech/ui/toast'
  import { computed, ref } from 'vue'

  import type { ShellConsoleNotification, ShellConsoleNotificationKind } from '../sample'

  defineProps<{ unread: number }>()

  const notifications = defineModel<ShellConsoleNotification[]>('notifications', { required: true })

  const icons: Record<ShellConsoleNotificationKind, string> = {
    'deploy-failed': 'az az-circle-x',
    'deploy-succeeded': 'az az-circle-check',
    info: 'az az-circle-info'
  }

  const PAGE_SIZE = 5

  const markAllRead = () => {
    notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
  }

  const shown = ref(PAGE_SIZE)
  const visibleNotifications = computed(() => notifications.value.slice(0, shown.value))
  const hiddenCount = computed(() => Math.max(notifications.value.length - shown.value, 0))

  const showOlder = () => {
    shown.value += PAGE_SIZE
  }

  const clearAll = () => {
    const cleared = notifications.value
    notifications.value = []
    toast.info('Notifications cleared.', {
      id: 'notifications-cleared',
      action: {
        label: 'Undo',
        onClick: () => {
          notifications.value = cleared
        }
      }
    })
  }

  const markRead = (id: string) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  }
</script>

<template>
  <section
    aria-label="Notification list"
    class="flex min-h-full flex-col"
  >
    <div
      v-if="notifications.length"
      class="flex shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
    >
      <span class="text-label-sm text-(--text-muted)">{{ unread }} unread</span>
      <div class="flex items-center gap-(--spacing-2xs)">
        <Button
          label="Mark all as read"
          variant="ghost"
          size="small"
          :disabled="!unread"
          @click="markAllRead"
        />
        <Button
          label="Clear all"
          variant="ghost"
          size="small"
          @click="clearAll"
        />
      </div>
    </div>

    <Item.List
      v-if="notifications.length"
      aria-label="Notifications"
    >
      <Item
        v-for="item in visibleNotifications"
        :key="item.id"
        size="small"
      >
        <Item.Media type="icon">
          <i
            :class="icons[item.kind]"
            :data-type="item.kind"
            class="data-[type=deploy-failed]:text-(--danger-mark) data-[type=deploy-succeeded]:text-(--success-mark) data-[type=info]:text-(--text-muted)"
            aria-hidden="true"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>
            <span
              v-if="!item.read"
              class="sr-only"
              >Unread:
            </span>
            {{ item.title }}
            <Tag
              v-if="!item.read"
              label="New"
              severity="info"
              size="small"
              aria-hidden="true"
            />
          </Item.Title>
          <Item.Description>{{ item.description }}</Item.Description>
          <span class="text-label-sm text-(--text-muted)">{{ item.time }}</span>
          <Item.Actions v-if="item.kind !== 'info'">
            <Button
              label="Edit"
              variant="outline"
              size="small"
              @click="markRead(item.id)"
            />
            <Button
              label="Redeploy"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="markRead(item.id)"
            />
          </Item.Actions>
        </Item.Content>
      </Item>
    </Item.List>
    <div
      v-if="hiddenCount"
      class="flex justify-center px-(--spacing-md) py-(--spacing-xs)"
    >
      <Button
        :label="`Show ${Math.min(hiddenCount, PAGE_SIZE)} older`"
        variant="ghost"
        size="small"
        @click="showOlder"
      />
    </div>

    <div
      v-if="!notifications.length"
      class="flex flex-1 items-center justify-center p-(--spacing-md)"
    >
      <EmptyState
        title="You are all caught up"
        description="Deploys, invitations and alerts for this account show up here."
        icon="az az-bell"
        size="small"
      />
    </div>
  </section>
</template>
