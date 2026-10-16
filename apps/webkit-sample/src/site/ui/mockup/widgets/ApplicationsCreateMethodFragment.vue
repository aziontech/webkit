<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationsCreateMethodFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; this fragment holds still either way. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const METHODS = [
    {
      icon: 'pi pi-github',
      title: 'Import from Git',
      description:
        'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.'
    },
    {
      icon: 'ai ai-azion-cli',
      title: 'Sync with Azion CLI',
      description:
        'Create the application now and push to it from your own terminal. Azion links the local project, builds it with your framework preset, and keeps azion.json in sync. No repository required.'
    },
    {
      icon: 'pi pi-objects-column',
      title: 'Start from a template',
      description:
        'Clone a framework starter already wired to build and deploy on Azion. Next, Astro, Vue, Nuxt, and more.'
    }
  ]
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="py-(--spacing-xs)">
      <MockupPart :order="0">
        <CardBox
          :padded="false"
          title="How do you want to start?"
        >
          <template #content>
            <Item.List>
              <Item
                v-for="method in METHODS"
                :key="method.title"
                size="small"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      :class="method.icon"
                      class="text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ method.title }}</Item.Title>
                  <Item.Description>{{ method.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
