<script setup>
  // PART 1 — WHERE DOES THE CODE COME FROM. The only question in this create whose
  // answer changes which questions follow, which is the whole reason the flow is in
  // parts at all.
  //
  // THE ROWS ARE THE ACTION, and on this part they are the ONLY action: choosing a
  // method answers the part and advances it in one press. So this part shows no bar at
  // all — no Back, because there is nothing behind the first part, and no Next, because
  // a Next here would ask the same question twice, once by selection and once by
  // confirmation, with nothing decided in between. The band retires with them rather
  // than sitting empty (../../../components/page/WizardPage.vue → `hasActions`); from the
  // second part on it is back, and permanent.
  //
  // So each row is a real <button>: the whole row, not a control inside it, via Item's
  // `as-child`, which merges the row shell (layout, hover ghost, focus ring) onto the
  // element supplied. One tab stop per method, Enter and Space both work, and the hit
  // target is the row the reader is already pointing at.
  //
  // ANATOMY: one CARD per part, its header carrying the part's question. The progress bar
  // above names the part in three words; the card header is where the question is
  // actually asked, and it travels with the thing it is asking about.
  //
  // The catalog is ../../../lib/data/application-flows.js, shared with the progress bar,
  // so a method's copy exists once.
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'

  import { APPLICATION_METHODS } from '../../../lib/data/application-flows'

  defineEmits(['select'])
</script>

<template>
  <CardBox
    :padded="false"
    title="How do you want to start?"
  >
    <template #content>
      <Item.List>
        <Item
          v-for="method in APPLICATION_METHODS"
          :key="method.id"
          as-child
          size="small"
        >
          <button
            type="button"
            class="w-full text-left"
            @click="$emit('select', method.id)"
          >
            <Item.Media>
              <!-- The glyph in a framed 32px tile, the same shell the repository and
                   template rows use, so the parts of this flow read as one object
                   changing rather than three lists that happen to be adjacent. -->
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="method.icon"
                  class="text-[1rem] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ method.title }}</Item.Title>
              <Item.Description>{{ method.description }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <!-- The affordance, not decoration: these rows go somewhere, and the arrow
                   says so before the reader spends a click finding out. -->
              <i
                class="pi pi-chevron-right text-(--text-muted)"
                aria-hidden="true"
              />
            </Item.Actions>
          </button>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
