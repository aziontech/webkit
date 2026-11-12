<script setup>
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <MenuRoot aria-label="Docs">
      <MenuGroup label="Docs">
        <MenuSub default-open>
          <MenuSubTrigger
            label="Build"
            kind="inline"
          />
          <MenuSubContent>
            <MenuItem
              label="Overview"
              icon=""
              href="/build"
            />
            <MenuSub default-open>
              <MenuSubTrigger
                label="Edge Application"
                kind="inline"
              />
              <MenuSubContent>
                <MenuItem
                  label="Rules Engine"
                  icon=""
                  href="/build/rules-engine"
                />
                <MenuItem
                  label="Cache Settings"
                  icon=""
                  href="/build/cache-settings"
                />
              </MenuSubContent>
            </MenuSub>
            <MenuSub>
              <MenuSubTrigger
                label="Edge Functions"
                kind="inline"
              />
              <MenuSubContent>
                <MenuItem
                  label="Runtime APIs"
                  icon=""
                  href="/build/runtime-apis"
                />
              </MenuSubContent>
            </MenuSub>
          </MenuSubContent>
        </MenuSub>
      </MenuGroup>
    </MenuRoot>
  </div>
</template>
