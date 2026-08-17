<script setup>
  // The deployment topology: one card per resource the release binds, and under each,
  // the dependencies that resource references.
  //
  // Three cards at most, and they are not equals:
  //
  //   Application  required. A release with nothing to serve is not a release, so it has
  //                no switch to turn off.
  //   Firewall     optional. Off means "not part of this release", which is a real
  //                choice and not the same as "none available".
  //   Custom Pages optional, same shape.
  //
  // READ-ONLY is the state that makes a scoped release honest. When the operator came to
  // change ONE resource, every other resource is kept from the release already serving —
  // so its card is reported with a lock rather than re-asked. The reader can see what
  // will be deployed without being invited to change things they did not come to change.
  import Badge from '@aziontech/webkit/badge'
  import CardBox from '@aziontech/webkit/card-box'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import { resourceIcon, resourceLabel } from '../../lib/data/releases'
  import ReleaseDependenciesSection from './ReleaseDependenciesSection.vue'
  import ResourceVersionField from './ResourceVersionField.vue'

  defineProps({
    // One entry per composed resource:
    // `{ type, resourceId, versionId, enabled, required, readonly, canToggle, note, groups,
    //    detecting, detectingLabel }`
    cards: { type: Array, default: () => [] },
    // The whole topology is inert while the release deploys.
    disabled: { type: Boolean, default: false }
  })

  // What a card's dependencies add up to. It rides the nested card's header so a block whose
  // groups are all closed still says how much is inside it.
  const dependencyCount = (card) =>
    (card.groups ?? []).reduce((total, group) => total + group.rows.length, 0)

  const emit = defineEmits([
    'update-resource',
    'update-version',
    'toggle',
    'update-dependency-version',
    'set-dependency-resource',
    'build'
  ])
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <section
      v-for="card in cards"
      :key="card.type"
      class="flex min-w-0 flex-col rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface)"
      :data-included="card.enabled || null"
    >
      <!-- The header carries a CardBox header's geometry (`min-h-14`, `px-md`, `py-sm`), so
           every card-like header on this screen reads at ONE height: this resource card, the
           Dependencies card nested inside it, and the four top-level cards around them. A 40px
           header above a 56px one inside the same card reads as two different kinds of card. -->
      <header
        class="flex min-h-14 min-w-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      >
        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            :class="[resourceIcon(card.type), 'shrink-0 text-(--text-muted)']"
            aria-hidden="true"
          />
          <span class="truncate text-label-md text-(--text-default)">
            {{ resourceLabel(card.type) }}
          </span>
        </span>

        <span class="flex shrink-0 items-center gap-(--spacing-xs)">
          <!-- The card's state, as a tag: required, or kept from the release that is
               already serving. Never both — a read-only card is not a decision. -->
          <Tag
            key="tag-1"
            v-if="card.readonly"
            label="Read-only"
            severity="secondary"
            size="medium"
            icon="pi pi-lock"
          />
          <Tag
            key="tag-2"
            v-else-if="card.required"
            label="Required"
            severity="warning"
            size="medium"
          />

          <Tooltip
            v-if="card.canToggle"
            :text="
              card.enabled
                ? `Leave ${resourceLabel(card.type)} out of this release`
                : `Include ${resourceLabel(card.type)} in this release`
            "
          >
            <Switch
              :model-value="card.enabled"
              :disabled="disabled"
              :aria-label="`Include ${resourceLabel(card.type)} in this release`"
              @update:model-value="emit('toggle', card.type, $event)"
            />
          </Tooltip>
        </span>
      </header>

      <!-- EMPTY: the card keeps its place and states WHY it is empty (the parent decides
           the sentence — off by choice, nothing bound, or no target selected yet). Removing
           the card would make an intentional choice look like a missing feature. -->
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

        <ResourceVersionField
          :type="card.type"
          :resource-id="card.resourceId"
          :version-id="card.versionId"
          :fixed="card.readonly"
          :disabled="disabled || card.readonly"
          @update:resource-id="emit('update-resource', card.type, $event)"
          @update:version-id="emit('update-version', card.type, $event)"
          @build="(type, id) => emit('build', type, id)"
        />

        <!-- The dependencies are their own SURFACE inside the resource's card: they belong to
             the resource above them, but they are a different KIND of thing — resolved from
             its version rather than chosen — and a nested card is what says so without a
             divider or a second title. `padded="false"` because the accordion rows own their
             inset: a card pad plus a row pad would indent the group headers off the column
             the fields above them hold, and would stop each row's hover surface short of the
             card's edges. -->
        <CardBox
          v-if="card.groups?.length"
          :padded="false"
        >
          <template #header>
            <!-- A LABEL, not an overline (the overline tokens are reserved for compact menu
                 and popover group labels), and at `--text-default`: it names a region the
                 reader acts inside, so it is not a muted aside. Its count is a Badge, the
                 same component the group rows below it use, so one adornment says "how many"
                 everywhere in this card. -->
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-label-md text-(--text-default)">Dependencies</span>
              <Badge
                v-if="!card.detecting"
                :label="String(dependencyCount(card))"
                severity="warning"
                size="medium"
              />
            </span>
          </template>

          <template #content>
            <ReleaseDependenciesSection
              :groups="card.groups"
              :detecting="card.detecting"
              :detecting-label="card.detectingLabel"
              :disabled="disabled || card.readonly"
              @update-version="
                (type, index, versionId) =>
                  emit('update-dependency-version', card.type, type, index, versionId)
              "
              @set-resource="
                (type, index, resourceId) =>
                  emit('set-dependency-resource', card.type, type, index, resourceId)
              "
              @build="(type, id) => emit('build', type, id)"
            />
          </template>
        </CardBox>
      </div>
    </section>
  </div>
</template>
