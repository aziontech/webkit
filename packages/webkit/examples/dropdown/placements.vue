<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-xl) place-items-center min-h-[24rem]">
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          kind="outlined"
          label="bottom-start"
        />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption
          value="a"
          label="Option A"
        />
        <DropdownOption
          value="b"
          label="Option B"
        />
      </DropdownGroup>
    </Dropdown>

    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          kind="outlined"
          label="bottom-end"
        />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption
          value="a"
          label="Option A"
        />
        <DropdownOption
          value="b"
          label="Option B"
        />
      </DropdownGroup>
    </Dropdown>

    <Dropdown placement="top-start">
      <DropdownTrigger>
        <Button
          kind="outlined"
          label="top-start"
        />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption
          value="a"
          label="Option A"
        />
        <DropdownOption
          value="b"
          label="Option B"
        />
      </DropdownGroup>
    </Dropdown>

    <Dropdown placement="top-end">
      <DropdownTrigger>
        <Button
          kind="outlined"
          label="top-end"
        />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption
          value="a"
          label="Option A"
        />
        <DropdownOption
          value="b"
          label="Option B"
        />
      </DropdownGroup>
    </Dropdown>
  </div>
</template>
