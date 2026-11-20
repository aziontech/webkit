<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import ShellConsole from '../shell-console.vue'

  type NotificationKind = 'deploy-failed' | 'deploy-succeeded' | 'info'

  type Notification = {
    id: string
    kind: NotificationKind
    title: string
    description: string
    time: string
    read: boolean
  }

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const icons: Record<NotificationKind, string> = {
    'deploy-failed': 'az az-circle-x',
    'deploy-succeeded': 'az az-circle-check',
    info: 'az az-circle-info'
  }

  const PAGE_SIZE = 5

  const notifications = ref<Notification[]>([
    {
      id: 'run-4182',
      kind: 'deploy-failed',
      title: 'azion-site failed to deploy',
      description: 'The build stopped at step 3 of 5: a module could not be resolved.',
      time: '2 min ago',
      read: false
    },
    {
      id: 'run-4181',
      kind: 'deploy-succeeded',
      title: 'edge-auth is live',
      description: 'Deployed to production in 48 seconds.',
      time: '25 min ago',
      read: false
    },
    {
      id: 'invite-77',
      kind: 'info',
      title: 'Sam joined the team',
      description: 'Sam accepted your invitation and can now edit applications.',
      time: 'Yesterday',
      read: true
    }
  ])
  const notificationsOpen = ref(true)
  const flashOpen = ref(true)

  const unread = computed(() => notifications.value.filter((item) => !item.read).length)
  const bellLabel = computed(() =>
    unread.value ? `Notifications, ${unread.value} unread` : 'Notifications'
  )

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

  const settleFlash = () => {
    markRead('run-4182')
    flashOpen.value = false
  }
</script>

<template>
  <ShellConsole
    v-model:tools-open="notificationsOpen"
    tools-label="Notifications"
    @sign-out="(event) => emit('sign-out', event)"
  >
    <template #actions>
      <span class="relative inline-flex">
        <Tooltip
          content="Notifications"
          side="bottom"
        >
          <IconButton
            icon="az az-bell"
            variant="outline"
            size="medium"
            :aria-label="bellLabel"
            :aria-pressed="notificationsOpen"
            @click="notificationsOpen = !notificationsOpen"
          />
        </Tooltip>
        <span
          v-if="unread"
          aria-hidden="true"
          class="pointer-events-none absolute -end-(--spacing-2xs) -top-(--spacing-2xs)"
        >
          <Badge
            :label="String(unread)"
            severity="danger"
            size="small"
          />
        </span>
      </span>
    </template>

    <template #notifications>
      <Alert
        v-if="flashOpen"
        severity="danger"
        closable
        @close="flashOpen = false"
      >
        azion-site failed to deploy. The version that was live keeps serving traffic.
        <template #actions>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Edit"
              variant="outline"
              size="small"
              @click="settleFlash"
            />
            <Button
              label="Redeploy"
              variant="primary"
              size="small"
              icon="az az-refresh"
              @click="settleFlash"
            />
          </div>
        </template>
      </Alert>
    </template>

    <template #tools>
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
                class="data-[type=deploy-failed]:text-(--danger) data-[type=deploy-succeeded]:text-(--success) data-[type=info]:text-(--text-muted)"
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
  </ShellConsole>
</template>
