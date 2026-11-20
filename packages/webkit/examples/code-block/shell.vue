<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Shell',
      value: 'shell',
      language: 'bash',
      code: '# Install the Azion CLI\ncurl -fsSL https://cli.azion.app/install.sh | bash\n\nexport AZION_TOKEN="$MY_TOKEN"\nazion link --preset vue\nazion deploy --auto # ship it'
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="shell"
      show-line-numbers
    />
  </div>
</template>
