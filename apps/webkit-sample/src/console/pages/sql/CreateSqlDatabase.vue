<script setup>
  // SQL Database — create flow. A focused creation shell (the /navigation skill):
  // the console sidebar is dropped so the single task owns the screen, and the
  // only chrome is one CreationHeader (back + brand + breadcrumb + account
  // avatar). The module create for a resource with a start and an end lands on a
  // dedicated PAGE (route /sql-database/new), not a modal, so it is linkable and
  // back-button-safe.
  //
  // The form is a single "General" section: the section title + guidance on the
  // left, the Name field (a Fields-separated triad — Label + control + helper) on
  // the right, inside one bordered CardBox. Validation runs on submit only; the
  // Name is required, so an empty submit reveals the amber `required` state (a
  // prompt to fill, NOT the red `invalid` — required is not an error). One
  // `submitting` flag locks the whole scope (fieldset :disabled + every control
  // :disabled + Save :loading, the /usability Pattern 1 lock); request-level
  // failures surface via toast, never silently.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const form = reactive({ name: '', active: true })
  const errors = reactive({ name: '', nameKind: 'required' })

  // One flag locks the whole scope while the create request is in flight.
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // The API's own constraint on the name: `^[A-Za-z0-9-]{6,50}$` on
  // POST /workspace/sql/databases. It is stated here rather than left to the server
  // because the name is also the database's address, and a 400 arriving a second
  // after Save is a worse way to learn about a space in it.
  const NAME_PATTERN = /^[A-Za-z0-9-]{6,50}$/

  // Validation runs on submit only. An empty message means valid; a populated one
  // drives the field's HelperText — amber `required` when the field is simply not
  // filled in yet, red `invalid` when what is in it cannot be accepted.
  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (!NAME_PATTERN.test(name)) {
      errors.nameKind = 'invalid'
      errors.name = 'Use 6 to 50 characters: letters, numbers and hyphens only.'
    } else {
      errors.name = ''
    }
    return !errors.name
  }

  const cancel = () => router.push({ path: '/sql-database', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // feedback is now on the field itself

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      const id = `db-${Date.now().toString(36)}`
      toast.success(`Database "${name}" created.`)
      commit() // the create landed — the leave guard stands down
      // Land on the new database's detail view, carrying its name so the header
      // reads it without a round-trip.
      router.push({
        path: `/sql-database/${id}`,
        query: { email: userEmail.value, name }
      })
    } catch (error) {
      toast.error('Could not create the database.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: 'SQL Database', href: '/sql-database' }, { label: 'Create Database' }]"
    back-label="Back to SQL Database"
    title="Create Database"
    description="A SQL Database instance that Applications, Functions and APIs can query at the edge."
    title-id="create-database-title"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The only field this endpoint requires. Between 6 and 50 characters: letters, numbers and hyphens."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Identifies the database wherever it is queried from. It cannot be changed later."
              :message="errors.name"
              :message-kind="errors.nameKind || 'required'"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  placeholder="my-new-database"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.name && errors.nameKind === 'required'"
                  :invalid="!!errors.name && errors.nameKind === 'invalid'"
                  :aria-describedby="messageId"
                  @update:model-value="errors.name = ''"
                />
              </template>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- `active` is optional to the endpoint and already defaults to true, so it sits
         behind the disclosure: a database can be created switched off and turned on
         once its schema is in place, but almost nobody does. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="compact"
              title="Active"
              description="An inactive database keeps its data and refuses connections."
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :disabled="submitting"
              />
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </CreatePage>
</template>
