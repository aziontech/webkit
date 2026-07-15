<script setup>
  // The app's standard left rail: a Sidebar whose top (reduced Azion brand + a
  // team switcher) and bottom (avatar + user name + account menu) are baked in as
  // the default across pages. In the switcher the team name is a static label;
  // only the icon button is interactive — it opens a Popover listing the teams
  // (each with its plan tag, member count, and a checkmark on the current one)
  // plus a "Create new team" action. The account menu is a Dropdown anchored to
  // the footer's overflow (⋮) button — grouped account/personal sections (each
  // with an identity header), the theme control, and Logout. The full Azion
  // Console navigation is baked in as the default body (grouped by product area,
  // mirroring the console); a page can still override it via the default slot.
  import Avatar from '@aziontech/webkit/avatar'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuItem from '@aziontech/webkit/menu-item'
  import Popover from '@aziontech/webkit/popover'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { computed, ref } from 'vue'

  import { useTheme } from '../../theme.js'

  const props = defineProps({
    // Signed-in user's email; the footer shows the local part as the display name.
    user: { type: String, default: 'myemail@azion.com' },
    // Display name; falls back to the email's local part when omitted.
    name: { type: String, default: '' },
    // Account + client identifiers shown in the menu's top identity block.
    accountId: { type: [String, Number], default: '6528' },
    clientId: { type: String, default: '9757a' },
    ariaLabel: { type: String, default: 'Sidebar' },
    // Id of the nav item to render as selected.
    active: { type: String, default: '' }
  })

  // `logout` fires when the Logout entry is chosen; `select` fires for any other
  // account-menu entry; `navigate` fires when a nav item is activated. All are
  // event-first per the activation-payload convention.
  const emit = defineEmits(['logout', 'select', 'navigate'])

  // Azion Console navigation, grouped by product area — the full set mirroring
  // the console's left rail. Items with a `path` route; the rest highlight only.
  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'ai ai-home', path: '/dashboard' },
        { id: 'marketplace', label: 'Marketplace', icon: 'ai ai-marketplace' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads' }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          path: '/applications'
        },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
        { id: 'forms', label: 'Forms', icon: 'pi pi-file-edit', path: '/forms' }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'connectors', label: 'Connectors', icon: 'ai ai-edge-connectors' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns' },
        { id: 'firewalls', label: 'Firewalls', icon: 'ai ai-edge-firewall' }
      ]
    },
    {
      label: 'Store',
      items: [
        { id: 'object-storage', label: 'Object Storage', icon: 'ai ai-edge-storage' },
        { id: 'sql-database', label: 'SQL Database', icon: 'ai ai-edge-sql', tag: 'Preview' }
      ]
    },
    {
      label: 'Deploy',
      items: [{ id: 'edge-nodes', label: 'Edge Nodes', icon: 'ai ai-edge-nodes' }]
    },
    {
      label: 'Observe',
      items: [
        { id: 'data-stream', label: 'Data Stream', icon: 'ai ai-data-stream' },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse' },
        { id: 'real-time-metrics', label: 'Real-Time Metrics', icon: 'ai ai-real-time-metrics' },
        { id: 'real-time-events', label: 'Real-Time Events', icon: 'ai ai-real-time-events' }
      ]
    },
    {
      label: 'Tools',
      items: [{ id: 'real-time-purge', label: 'Real-Time Purge', icon: 'ai ai-real-time-purge' }]
    },
    {
      label: 'Edge Libraries',
      items: [
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-digital-certificates'
        },
        { id: 'custom-pages', label: 'Custom Pages', icon: 'ai ai-custom-pages' },
        { id: 'edge-services', label: 'Edge Services', icon: 'ai ai-edge-services' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions' },
        { id: 'network-lists', label: 'Network Lists', icon: 'ai ai-network-lists' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules' }
      ]
    }
  ]

  const { theme } = useTheme()
  const userName = computed(() => props.name || props.user.split('@')[0])

  // Team switcher (sidebar top): the signed-in user's team is the default, named
  // "<user> Team". A couple of shared teams round out the list; each carries a
  // plan tag + member count like the console. Only the icon button is
  // interactive — the name is a static label.
  const teams = computed(() => [
    { id: 'user-team', label: `${userName.value} Team`, plan: 'Free', members: 1 },
    { id: 'platform', label: 'Platform Team', plan: 'Business', members: 8 },
    { id: 'security', label: 'Security Team', plan: 'Business', members: 4 }
  ])
  const selectedTeam = ref('user-team')
  const selectedTeamLabel = computed(
    () => teams.value.find((team) => team.id === selectedTeam.value)?.label ?? teams.value[0].label
  )

  // The switcher popover is controlled so choosing a team (or "Create new team")
  // closes it.
  const teamMenuOpen = ref(false)
  const selectTeam = (event, value) => {
    selectedTeam.value = value
    teamMenuOpen.value = false
  }
  const createTeam = () => {
    teamMenuOpen.value = false
  }

  // The two grouped sections of the account menu.
  const accountLinks = [
    { id: 'account-settings', label: 'Account Settings' },
    { id: 'users-management', label: 'Users Management' },
    { id: 'billing', label: 'Billing' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'activity-history', label: 'Activity History' },
    { id: 'teams-permissions', label: 'Teams Permissions' }
  ]
  const personalLinks = [
    { id: 'your-settings', label: 'Your Settings' },
    { id: 'personal-token', label: 'Personal Token' }
  ]

  // Dropdown emits (event, value) and closes itself on select; route the Logout
  // entry to its own event and everything else to a generic select.
  const onSelect = (event, value) => {
    if (value === 'logout') emit('logout', event)
    else emit('select', event, value)
  }
</script>

<template>
  <aside class="w-[var-(--container-xl)] shrink-0">
    <Sidebar :aria-label="ariaLabel">
      <template #header>
        <!-- Standalone reduced Azion brand + a team switcher pill. The name is a
             static label; only the icon button is interactive (opens the team
             popover — mirrors the console's team menu). -->
        <div class="flex  items-center gap-[var(--spacing-sm)] pl-[var(--spacing-xxs)] pr-[var(--spacing-xs)]">
          <div class="size-[var(--size-8)] flex items-center justify-center">
            <AzionLogoMin
            class="h-[var(--size-4)] w-auto shrink-0"
            aria-label="Azion"
          />

          </div>
          
          <div
            class="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)]"
          >
            <Avatar
              :label="selectedTeamLabel"
              size="small"
              kind="square"
            />
            <span
              class="min-w-0 flex-1 truncate px-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)]"
            >
              {{ selectedTeamLabel }}
            </span>

            <Popover
              v-model:open="teamMenuOpen"
              placement="bottom-end"
              width="small"
            >
              <Popover.Trigger>
                <IconButton
                  icon="pi pi-sort-alt"
                  aria-label="Switch team"
                  kind="transparent"
                  size="small"
                />
              </Popover.Trigger>

              <Popover.Content>
                <div class="flex flex-col p-[var(--spacing-xxs)]">
                  <p
                    class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
                  >
                    Teams
                  </p>

                  <button
                    v-for="team in teams"
                    :key="team.id"
                    type="button"
                    class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left transition-colors hover:bg-[var(--bg-hover)]"
                    @click="(event) => selectTeam(event, team.id)"
                  >
                    <Avatar
                      :label="team.label"
                      size="medium"
                      kind="square"
                    />
                    <span class="flex min-w-0 flex-1 flex-col">
                      <span class="flex items-center ">
                        <span class="truncate text-label-sm text-[var(--text-default)]">
                          {{ team.label }}
                        </span>
                        <Tag
                          :value="team.plan"
                          severity="secondary"
                          size="small"
                          
                        />
                      </span>
                      <span class="text-body-xs text-[var(--text-muted)]">
                        {{ team.members }} team member{{ team.members === 1 ? '' : 's' }}
                      </span>
                    </span>
                    <i
                      v-if="team.id === selectedTeam"
                      class="pi pi-check shrink-0 text-body-sm text-[var(--text-default)]"
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    class="my-[var(--spacing-xxs)] h-px bg-[var(--border-muted)]"
                    role="separator"
                  />

                  <button
                    type="button"
                    class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-sm text-[var(--text-default)] transition-colors hover:bg-[var(--bg-hover)]"
                    @click="createTeam"
                  >
                    <i
                      class="pi pi-plus text-body-xs"
                      aria-hidden="true"
                    />
                    Create new team
                  </button>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </div>
      </template>

      <slot>
        <SidebarGroup
          v-for="(group, i) in navGroups"
          :key="group.label ?? `group-${i}`"
          :label="group.label"
        >
          <MenuItem
            v-for="item in group.items"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :selected="active === item.id"
            :tag-value="item.tag"
            @click="(event) => emit('navigate', event, item)"
          />
        </SidebarGroup>
      </slot>

      <template #footer>
        <div class="flex items-center pt-[var(--spacing-sm)] gap-[var(--spacing-xs)]">
          <Avatar
            :label="user"
            size="small"
            kind="square"
          />
          <span class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)]">
            {{ userName }}
          </span>

          <Dropdown
            placement="top-end"
            @select="onSelect"
          >
            <Dropdown.Trigger>
              <IconButton
                icon="pi pi-ellipsis-v"
                aria-label="Account menu"
                kind="outlined"
                size="small"
              />
            </Dropdown.Trigger>

            <!-- Account identity + account-level links -->
            <Dropdown.Group>
              <template #top>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-label-md text-[var(--text-default)]">
                    {{ userName }}
                  </span>
                  <span class="text-body-xs text-[var(--text-muted)]">
                    ID: {{ accountId }}&nbsp;&nbsp;Client ID: {{ clientId }}
                  </span>
                </div>
              </template>
              <Dropdown.Option
                v-for="link in accountLinks"
                :key="link.id"
                :value="link.id"
                :label="link.label"
              />
            </Dropdown.Group>

            <!-- User identity + personal links + theme control -->
            <Dropdown.Group>
              <template #top>
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-label-md text-[var(--text-default)]">
                    {{ userName }}
                  </span>
                  <span class="text-body-xs text-[var(--text-muted)]">
                    {{ user }}
                  </span>
                </div>
              </template>
              <Dropdown.Option
                v-for="link in personalLinks"
                :key="link.id"
                :value="link.id"
                :label="link.label"
              />
              <!-- Theme row: not a selectable menuitem, but mirrors the
                   Option's height/padding so it aligns with the rows above. -->
              <div
                class="flex h-8 min-h-8 items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]"
              >
                <span class="flex-1 truncate text-left text-label-sm text-[var(--text-default)]">
                  Theme
                </span>
                <ThemeSwitcher
                  v-model:value="theme"
                  aria-label="Theme"
                />
              </div>
            </Dropdown.Group>

            <!-- Logout -->
            <Dropdown.Group>
              <Dropdown.Option
                value="logout"
                label="Logout"
              >
                <template #left>
                  <i
                    class="pi pi-sign-out"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>
          </Dropdown>
        </div>
      </template>
    </Sidebar>
  </aside>
</template>
