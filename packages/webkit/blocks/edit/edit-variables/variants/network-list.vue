<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import { toast } from '@aziontech/webkit/toast'
  import { ref, watch } from 'vue'

  import { provideNetworkListForm, useNetworkListForm } from '../composables/use-network-list-form'
  import { plural } from '../lib/variables-format'
  import NetworkListFields from '../parts/network-list-fields.vue'
  import VariablesDrawerForm from '../parts/variables-drawer-form.vue'
  import { sampleNetworkList } from '../sample'

  const form = useNetworkListForm()
  provideNetworkListForm(form)

  const drawerOpen = ref(false)
  const submitting = ref(false)

  watch(drawerOpen, (isOpen) => {
    if (isOpen) form.reset('Office and partners', sampleNetworkList)
  })

  const submit = async (_event: Event, formEl: HTMLFormElement | null) => {
    if (submitting.value || !(await form.check(formEl))) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const count = form.count()
    submitting.value = false
    drawerOpen.value = false
    toast.success(`${form.name.value.trim()} created.`, {
      description: `${plural(count, 'entry', 'entries')}, ready to use in firewall rules.`
    })
  }
</script>

<template>
  <Drawer
    v-model:open="drawerOpen"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <div class="w-full md:w-fit">
        <Button
          label="Create Network List"
          icon="az az-plus"
          variant="primary"
          size="large"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <VariablesDrawerForm
      title="Create Network List"
      description="A list of addresses, ASNs or countries that firewall rules allow or refuse."
      shortcut-label="Save network list"
      :active="drawerOpen"
      :submitting="submitting"
      @submit="submit"
    >
      <NetworkListFields />
    </VariablesDrawerForm>
  </Drawer>
</template>
