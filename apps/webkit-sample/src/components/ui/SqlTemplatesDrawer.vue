<script setup>
// SQL Quick Templates — a right Drawer of ready-to-run query snippets the Editor
// opens from its "Templates" button. Choosing a card emits its SQL back to the
// editor and closes; the search filters the grid by title and description. The
// Drawer composes the webkit Drawer + Panel regions (it traps focus and restores
// it to the trigger on close), and the tiles are token-styled buttons — the same
// hand-rolled affordance the sidebar's team switcher uses.
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import InputText from "@aziontech/webkit/input-text";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelHeader from "@aziontech/webkit/panel-header";
import { computed, ref, watch } from "vue";

// Two-way open state, so the parent drives it with v-model:open.
const open = defineModel("open", { type: Boolean, default: false });

// `select` carries the chosen template's SQL; the parent loads it into the editor.
const emit = defineEmits(["select"]);

// The template catalog — each a real, runnable snippet. Relational templates
// operate on a `users` table; the vector templates mirror Edge SQL's native
// vector support (a `products` table with an embedding column).
const templates = [
  {
    id: "create-table",
    title: "Create Table",
    description: "Create a basic users table with auto-increment ID and timestamp",
    icon: "pi pi-table",
    sql: `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
  },
  {
    id: "insert-data",
    title: "Insert Data",
    description: "Insert sample user records into the users table",
    icon: "pi pi-plus-circle",
    sql: `INSERT INTO users (name, email) VALUES
  ('Ada Lovelace', 'ada@azion.com'),
  ('Alan Turing', 'alan@azion.com'),
  ('Grace Hopper', 'grace@azion.com');`,
  },
  {
    id: "select-all",
    title: "Select All",
    description: "Retrieve all records from users table with limit",
    icon: "pi pi-list",
    sql: `SELECT id, name, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 100;`,
  },
  {
    id: "count-records",
    title: "Count Records",
    description: "Count total number of records in users table",
    icon: "pi pi-hashtag",
    sql: `SELECT COUNT(*) AS total_users FROM users;`,
  },
  {
    id: "vector-table",
    title: "Vector Table",
    description: "Create a products table with vector embeddings for AI search",
    icon: "pi pi-box",
    sql: `CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  embedding F32_BLOB(4)
);`,
  },
  {
    id: "insert-vectors",
    title: "Insert Vectors",
    description: "Insert sample products with vector embeddings",
    icon: "pi pi-arrow-right-arrow-left",
    sql: `INSERT INTO products (name, description, embedding) VALUES
  ('Edge Cache', 'Low-latency caching', vector('[0.10, 0.20, 0.30, 0.40]')),
  ('Edge SQL', 'Distributed database', vector('[0.15, 0.25, 0.35, 0.45]'));`,
  },
  {
    id: "vector-search",
    title: "Vector Search",
    description: "Search products using cosine similarity with vector embeddings",
    icon: "pi pi-search",
    sql: `SELECT name, description,
  vector_distance_cos(embedding, vector('[0.12, 0.22, 0.32, 0.42]')) AS distance
FROM products
ORDER BY distance ASC;`,
  },
  {
    id: "create-vector-index",
    title: "Create Vector Index",
    description: "Create an index to optimize vector search performance",
    icon: "pi pi-sitemap",
    sql: `CREATE INDEX IF NOT EXISTS products_embedding_idx
ON products (libsql_vector_idx(embedding));`,
  },
  {
    id: "vector-top-k",
    title: "Vector Top K Query",
    description: "Find top 3 most similar products using vector distance",
    icon: "pi pi-sort-amount-down",
    sql: `SELECT name,
  vector_distance_cos(embedding, vector('[0.12, 0.22, 0.32, 0.42]')) AS distance
FROM products
ORDER BY distance ASC
LIMIT 3;`,
  },
];

const query = ref("");
const filtered = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) return templates;
  return templates.filter(
    (template) =>
      template.title.toLowerCase().includes(term) ||
      template.description.toLowerCase().includes(term),
  );
});

// Reset the search each time the drawer opens so it never lands pre-filtered.
watch(open, (value) => {
  if (value) query.value = "";
});

const choose = (template) => {
  emit("select", template.sql);
  open.value = false;
};
</script>

<template>
  <Drawer v-model:open="open" size="large" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
            <DrawerTitle>SQL Quick Templates</DrawerTitle>
            <p class="text-body-sm text-[var(--text-muted)]">
              Pick a snippet to load it into the editor.
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
          <InputText
            v-model="query"
            size="large"
            class="w-full"
            placeholder="Search templates..."
            aria-label="Search templates"
          >
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>

          <div
            v-if="filtered.length"
            class="grid grid-cols-1 gap-[var(--spacing-sm)] md:grid-cols-2"
          >
            <button
              v-for="template in filtered"
              :key="template.id"
              type="button"
              class="flex flex-col gap-[var(--spacing-xxs)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-md)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:border-[var(--border-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
              @click="choose(template)"
            >
              <span class="flex items-center gap-[var(--spacing-xs)]">
                <i
                  :class="template.icon"
                  class="text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <span class="text-label-md text-[var(--text-default)]">
                  {{ template.title }}
                </span>
              </span>
              <span class="text-body-xs text-[var(--text-muted)]">
                {{ template.description }}
              </span>
            </button>
          </div>

          <p
            v-else
            class="py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
          >
            No templates match "{{ query }}".
          </p>
        </PanelContent>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
