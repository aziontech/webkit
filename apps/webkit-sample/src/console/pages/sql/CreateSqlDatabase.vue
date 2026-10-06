<script setup>
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
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const form = reactive({ name: '', active: true })
  const errors = reactive({ name: '', nameKind: 'required' })

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const NAME_PATTERN = /^[A-Za-z0-9-]{6,50}$/

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

  const { path: originPath, label: originLabel } = useCreateOrigin('/sql-database', 'SQL Database')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      const id = `db-${Date.now().toString(36)}`
      toast.success(`Database "${name}" created.`)
      commit()
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
      submitting.value = false
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Database' }]"
    :back-label="`Back to ${originLabel}`"
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
      hint="The only field this endpoint requires."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Identifies the database wherever it is queried from. It cannot be changed later. Between 6 and 50 characters: letters, numbers and hyphens."
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
