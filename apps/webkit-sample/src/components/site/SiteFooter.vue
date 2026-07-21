<script setup>
  // Marketing site footer — the azion.com/pt-br footer, rebuilt on tokens. A
  // brand column with the reduced lockup and a short line, then link columns
  // (Produtos, Soluções, Desenvolvedores, Empresa), and a bottom bar with the
  // copyright and legal links. Every link is a `#` anchor for the demo.
  import Brand from '@aziontech/webkit/brand'
  import IconButton from '@aziontech/webkit/icon-button'

  const columns = [
    {
      label: 'Produtos',
      links: ['Functions', 'Cache', 'Object Storage', 'SQL Database', 'WAF', 'Edge DNS', 'Data Stream']
    },
    {
      label: 'Soluções',
      links: ['Web Apps', 'AI', 'Application Security', 'Serviços Financeiros', 'Varejo', 'Tecnologia']
    },
    {
      label: 'Desenvolvedores',
      links: ['Documentação', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    {
      label: 'Empresa',
      links: ['Sobre', 'Clientes', 'Parceiros', 'Carreiras', 'Blog', 'Contato']
    }
  ]

  const legal = ['Termos de Uso', 'Privacidade', 'Cookies', 'Segurança']

  const socials = [
    { icon: 'ai ai-x', label: 'X' },
    { icon: 'ai ai-medium', label: 'Medium' },
    { icon: 'pi pi-github', label: 'GitHub' },
    { icon: 'pi pi-linkedin', label: 'LinkedIn' }
  ]

  const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-[var(--border-muted)] bg-[var(--bg-surface)]">
    <div class="mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
      <div class="grid grid-cols-2 gap-[var(--spacing-xl)] md:grid-cols-3 lg:grid-cols-6">
        <!-- Brand column spans two tracks so the link columns stay compact. -->
        <div class="col-span-2 flex flex-col gap-[var(--spacing-md)]">
          <Brand
            kind="default"
            size="medium"
          />
          <p class="max-w-[var(--container-2xs)] text-pretty text-body-sm text-[var(--text-muted)]">
            Infraestrutura distribuída para o deploy de workloads modernos em escala global.
          </p>
          <div class="flex items-center gap-[var(--spacing-xs)]">
            <IconButton
              v-for="social in socials"
              :key="social.label"
              :icon="social.icon"
              :aria-label="social.label"
              kind="outlined"
              size="medium"
              href="#"
            />
          </div>
        </div>

        <nav
          v-for="column in columns"
          :key="column.label"
          class="flex flex-col gap-[var(--spacing-sm)]"
          :aria-label="column.label"
        >
          <h3 class="text-overline-sm text-[var(--text-muted)]">{{ column.label }}</h3>
          <ul class="flex flex-col gap-[var(--spacing-xs)]">
            <li
              v-for="link in column.links"
              :key="link"
            >
              <a
                href="#"
                class="text-body-sm text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
              >
                {{ link }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-[var(--spacing-xl)] flex flex-col items-start gap-[var(--spacing-sm)] border-t border-[var(--border-muted)] pt-[var(--spacing-lg)] sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-body-xs text-[var(--text-muted)]">© {{ year }} Azion Technologies. Todos os direitos reservados.</p>
        <ul class="flex flex-wrap items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)]">
          <li
            v-for="item in legal"
            :key="item"
          >
            <a
              href="#"
              class="text-body-xs text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
            >
              {{ item }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
