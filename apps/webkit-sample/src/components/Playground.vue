<script setup>
// Playground — a test surface for appearance settings. An ItemGroup settings
// form (the Account Settings pattern: an section title over a flush CardBox
// whose body is an Item.List) where the user picks the primary FONT FAMILY and
// the SYSTEM APPEARANCE (theme). Both apply LIVE — this is a preview harness,
// not a persisted form, so there is no Save; each Select drives its singleton
// (src/font.js, src/theme.js) directly and the choice is remembered across
// reloads. A preview panel below shows the current type scale and a few
// components so the font/theme swap is immediately visible.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Select from "@aziontech/webkit/select";
import Tag from "@aziontech/webkit/tag";
import { computed } from "vue";

import { useFont } from "../font.js";
import { useTheme } from "../theme.js";
import AppLayout from "./ui/AppLayout.vue";
import PageHeading from "./ui/PageHeading.vue";

const { font, fonts } = useFont();
const { theme } = useTheme();

// System appearance options — mirror the theme singleton's modes.
const appearances = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const labelOf = (list) => (value) =>
  list.find((option) => option.value === value)?.label ?? "";

const fontLabel = computed(() => labelOf(fonts)(font.value));
</script>

<template>
  <AppLayout active="playground" :padded="false" :breadcrumb="[{ label: 'Playground' }]">
    <div class="flex w-full flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]">
      <PageHeading
        title-id="playground-title"
        title="Playground"
        description="Test surface for appearance settings. Choose the primary font family and the system appearance — both apply live and are remembered across reloads. Only the sans face is swapped; the type scale, code, overlines, and icons keep their own faces."
      />

      <!-- Section: Appearance — an section title over a flush CardBox. -->
      <section class="flex flex-col gap-[var(--spacing-sm)]">
        <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
          Appearance
        </p>
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item size="small">
                <Item.Content>
                  <Item.Title>Font family</Item.Title>
                  <Item.Description>
                    The primary sans typeface used across the console. Non-default
                    faces load on demand from Google Fonts.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="flex-1 justify-end">
                  <Select
                    v-model="font"
                    size="large"
                    class="w-full max-w-[var(--container-2xs)]"
                    :display-value="labelOf(fonts)"
                  >
                    <Select.Trigger id="playground-font" aria-label="Font family" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in fonts"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </Item.Actions>
              </Item>

              <Item size="small">
                <Item.Content>
                  <Item.Title>System appearance</Item.Title>
                  <Item.Description>
                    Follow the operating system, or force a light or dark theme.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="flex-1 justify-end">
                  <Select
                    v-model="theme"
                    size="large"
                    class="w-full max-w-[var(--container-2xs)]"
                    :display-value="labelOf(appearances)"
                  >
                    <Select.Trigger id="playground-appearance" aria-label="System appearance" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in appearances"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>

      <!-- Section: Preview — shows the active font/theme across the type scale
           and a few components so the swap is immediately visible. -->
      <section class="flex flex-col gap-[var(--spacing-sm)]">
        <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
          Preview · {{ fontLabel }}
        </p>
        <CardBox>
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-lg)]">
              <div class="flex flex-col gap-[var(--spacing-xs)]">
                <p class="text-heading-2xl text-[var(--text-default)]">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p class="text-heading-md text-[var(--text-default)]">
                  Heading · 1234567890 · AaBbCcDdEeFfGg
                </p>
                <p class="text-body-md text-[var(--text-muted)]">
                  Body copy renders in the selected sans face while the size,
                  weight, and letter-spacing tokens stay exactly as the design
                  system defines them. Only the family is forced.
                </p>
                <p class="text-label-code-md text-[var(--text-muted)]">
                  const code = "stays on Roboto Mono";
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-[var(--spacing-sm)]">
                <Button label="Primary" kind="primary" size="medium" />
                <Button label="Secondary" kind="secondary" size="medium" />
                <Button label="Outlined" kind="outlined" size="medium" />
                <Tag value="Active" severity="success" size="small" />
                <Tag value="Preview" severity="secondary" size="small" />
              </div>

              <InputText
                model-value="Sample input text"
                size="large"
                class="w-full max-w-[var(--container-xs)]"
                aria-label="Sample input"
              />
            </div>
          </template>
        </CardBox>
      </section>
    </div>
  </AppLayout>
</template>
