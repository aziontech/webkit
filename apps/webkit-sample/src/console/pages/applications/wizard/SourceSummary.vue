<script setup>
  // WHAT IS BEING DEPLOYED — the identity of the thing this flow is about, kept on
  // screen from the moment it is chosen until the run that ships it is over.
  //
  // It was born inline in the Configure part of ../CreateApplication.vue, for one
  // reason: the reader chose the source one part ago and now has to name and build it,
  // so losing sight of it is how a template deploy ends up with the wrong project name.
  // The same reason holds one phase LATER. When the commit flips the flow to its
  // terminal phase, the rail, the bands and the bar all retire — correctly, nothing is
  // asked there — and the source row used to retire with them, leaving a page whose only
  // content was a progress card that never names what it is provisioning. The reader who
  // pressed "Create and deploy" on the wrong template had no way to see it from the
  // screen watching it happen.
  //
  // So it is a component, rendered by both phases (../CreateApplication.vue):
  //   Configure   — with Change on each row, because both answers are still the
  //                 reader's to revise.
  //   Deploying   — read-only. The clone is in flight; there is nothing to change, and
  //                 a live Change beside a running deploy offers an action that cannot
  //                 be honoured.
  //
  // This is the same move the Creation Center's template deploy already makes: its
  // TemplatePreview strip persists across the form AND deploy phases and gives way only
  // on success (../../marketplace/DeployTemplate.vue), where the outcome card becomes the
  // record of what shipped. This flow now behaves the same way.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'

  defineProps({
    // The chosen source, in the one shape all three flows emit (see
    // ../wizard/GitSourceStep.vue → emitSource).
    source: { type: Object, default: null },
    // WHERE a copy of it lands — the template flow's answer, and only that flow's.
    // Absent for a git import and for from scratch, and the second row drops with it.
    repository: { type: Object, default: null },
    // Offer the way back to the parts that answered these. Off once the flow is past
    // its questions: the run cannot be re-pointed, so a Change there would be a button
    // that does nothing.
    changeable: { type: Boolean, default: true },
    // The commit is in flight — the rows stay readable, their actions do not stay live.
    disabled: { type: Boolean, default: false }
  })

  defineEmits(['change'])
</script>

<template>
  <CardBox
    v-if="source"
    :padded="false"
  >
    <template #content>
      <Item size="small">
        <Item.Media>
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <!-- The mark the source part drew, drawn again: an Azion template is marked
                 by its vendor there (./TemplateSourceStep.vue), so it is marked by its
                 vendor here. A row that changes its mark between the part that chose it
                 and the part that confirms it reads as a different thing. -->
            <AzionLogoMin
              v-if="source.vendor === 'Azion'"
              class="h-4 w-auto shrink-0"
              aria-hidden="true"
            />
            <i
              v-else
              :class="source.icon"
              class="text-[1rem] leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ source.title }}</Item.Title>
          <Item.Description>{{ source.description }}</Item.Description>
        </Item.Content>
        <Item.Actions v-if="changeable">
          <Button
            type="button"
            label="Change"
            kind="text"
            size="small"
            :disabled="disabled"
            @click="$emit('change', 'source')"
          />
        </Item.Actions>
      </Item>

      <!-- AND WHERE IT LANDS, when there is a clone. Every field below this is about the
           thing that will live there, so the destination stays on screen with its own way
           back — a template deployed into the wrong account is the mistake this row
           exists to prevent. -->
      <Item
        v-if="repository?.name"
        size="small"
        class="border-t border-(--border-default)"
      >
        <Item.Media>
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="pi pi-github text-[1rem] leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ repository.owner }}/{{ repository.name }}</Item.Title>
          <Item.Description>
            {{
              repository.mode === 'new'
                ? `A new ${repository.visibility} repository, created from the template.`
                : 'An existing repository of yours, deployed as it is.'
            }}
          </Item.Description>
        </Item.Content>
        <Item.Actions v-if="changeable">
          <Button
            type="button"
            label="Change"
            kind="text"
            size="small"
            :disabled="disabled"
            @click="$emit('change', 'repository')"
          />
        </Item.Actions>
      </Item>
    </template>
  </CardBox>
</template>
