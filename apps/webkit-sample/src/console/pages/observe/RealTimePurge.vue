<script setup>
  // Real-Time Purge — the Azion Console "Real-Time Purge" module. The only page in
  // the Observe area that is neither a list nor a dashboard: purging is an ACTION,
  // taken once, on arguments you type. There is nothing to browse, so there is no
  // table, no search and no filter bar — a controls row here would be an empty
  // container.
  //
  // It is a create-flow shape rather than a settings shape: the FORM measure
  // (`.layout-column-form`), one card of fields, and a sticky footer holding the one
  // destructive action. That footer is where Purge lives rather than beside the
  // fields, because the button is the point of the page and it must stay reachable
  // while a long argument list scrolls.
  //
  // WHAT MAKES IT DIFFERENT FROM EVERY OTHER FORM HERE: the action is irreversible
  // and account-wide, so it confirms before it runs (a Dialog naming what will be
  // purged), and the destructive button is `severity="danger"`, not primary.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dialog from '@aziontech/webkit/dialog'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import Message from '@aziontech/webkit/message'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  // The three things Azion can purge, and what each one takes. The HELP text is per
  // type because the argument format changes with it — a URL list and a cache-key
  // list look nothing alike, and a shared placeholder would be wrong for two of three.
  const PURGE_TYPES = [
    {
      value: 'url',
      label: 'URL',
      description: 'Purge specific addresses, one per line.',
      placeholder: 'www.example.com/index.html\nwww.example.com/style.css',
      hint: 'One full URL per line, without the protocol.'
    },
    {
      value: 'cache-key',
      label: 'Cache key',
      description: 'Purge by the key the edge stored the object under.',
      placeholder: 'https://www.example.com/@@ptr_ver=1\nhttps://www.example.com/img@@cookie=abc',
      hint: 'One cache key per line, including any @@ variations.'
    },
    {
      value: 'wildcard',
      label: 'Wildcard',
      description: 'Purge everything matching a pattern. One expression only.',
      placeholder: 'www.example.com/images/*',
      hint: 'A single expression. A wildcard purge cannot be undone or narrowed after it runs.'
    }
  ]

  const type = ref('url')
  const args = ref('')
  const confirming = ref(false)
  const purging = ref(false)

  const selected = computed(() => PURGE_TYPES.find((entry) => entry.value === type.value))

  // The lines that will actually be sent — blank lines and stray whitespace dropped,
  // so the confirmation counts what the request counts rather than what was typed.
  const entries = computed(() =>
    args.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const canPurge = computed(() => entries.value.length > 0)

  // The count is what the confirmation leads with: "Purge 14 URLs" is a decision;
  // "Are you sure?" is not.
  const summary = computed(() => {
    const count = entries.value.length
    const noun = selected.value.label.toLowerCase()
    return count === 1 ? `1 ${noun}` : `${count} ${noun}s`
  })

  const run = async () => {
    purging.value = true
    await new Promise((resolve) => globalThis.setTimeout(resolve, 900))
    purging.value = false
    confirming.value = false
    const purged = summary.value
    args.value = ''
    toast.success(`Purge requested for ${purged}.`, {
      description: 'Objects are evicted from every edge location within seconds.'
    })
  }
</script>

<template>
  <AppLayout
    active="real-time-purge"
    :breadcrumb="[{ label: 'Real-Time Purge' }]"
    :padded="false"
  >
    <!-- The form measure, not the data one: this page is a single stacked column of
         fields, and past ~1200px the extra width would land inside the controls. -->
    <div class="flex min-h-full min-w-0 flex-col">
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeading
          title="Real-Time Purge"
          description="Evict cached objects from every edge location. Purged content is fetched from your connector on the next request."
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
          <Message
            severity="warning"
            size="small"
            label="A purge cannot be undone. Every purged object is re-fetched from your connector on its next request, so a broad purge briefly raises origin traffic."
          />

          <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
                  <fieldset class="flex min-w-0 flex-col gap-[var(--spacing-sm)]">
                    <legend class="text-label-md text-[var(--text-default)]">Purge type</legend>
                    <div class="grid grid-cols-1 gap-[var(--spacing-xs)] md:grid-cols-3">
                      <FieldRadioBlock
                        v-for="entry in PURGE_TYPES"
                        :key="entry.value"
                        v-model="type"
                        name="purge-type"
                        :value="entry.value"
                        :label="entry.label"
                        :description="entry.description"
                      />
                    </div>
                  </fieldset>

                  <!-- Keyed on the type so switching it re-renders the field: the
                       placeholder and the hint both change with the type, and a
                       re-used node keeps the old ones until the next keystroke. -->
                  <FieldTextarea
                    :key="type"
                    v-model="args"
                    :label="`${selected.label} list`"
                    :placeholder="selected.placeholder"
                    :hint="selected.hint"
                    :rows="8"
                  />
                </div>
              </template>
            </CardBox>
          </section>
        </section>
      </div>

      <!-- The sticky action bar. It carries the same column class and the inline half
           of the boundary as the body above it, so its button sits on the same axis as
           the fields it acts on rather than 24px inside them. -->
      <footer
        class="sticky bottom-0 z-10 border-t border-[var(--border-default)] bg-[var(--bg-canvas)] py-[var(--spacing-sm)]"
      >
        <div class="layout-column-form layout-boundary-inline flex items-center justify-end">
          <Button
            label="Purge"
            kind="primary"
            severity="danger"
            size="large"
            icon="pi pi-trash"
            :disabled="!canPurge"
            @click="confirming = true"
          />
        </div>
      </footer>
    </div>

    <!-- Confirm before an irreversible, account-wide action. The dialog names WHAT
         will be purged and HOW MUCH, so the decision is made on the numbers rather
         than on a generic "are you sure". -->
    <Dialog
      v-model:open="confirming"
      title="Purge cached content?"
      :description="`This purges ${summary} from every edge location. It cannot be undone, and the objects are re-fetched from your connector on their next request.`"
    >
      <template #footer>
        <Button
          label="Cancel"
          kind="outlined"
          size="large"
          :disabled="purging"
          @click="confirming = false"
        />
        <Button
          label="Purge"
          kind="primary"
          severity="danger"
          size="large"
          :loading="purging"
          @click="run"
        />
      </template>
    </Dialog>
  </AppLayout>
</template>
