# Card Component

A versatile card component built on top of **PrimeVue Card** with support for multiple variants, markdown content, and interactive states.

## Features

- **PrimeVue Base**: Built using PrimeVue Card component with PassThrough API for customization
- **Multiple Variants**: Default and outline styles with decorative dots
- **Markdown Support**: Parse and render markdown content in descriptions
- **Interactive States**: Hover effects and clickable cards with links
- **Icon Support**: Optional PrimeVue icons
- **Responsive Design**: Mobile-first approach with responsive spacing
- **Theme Support**: Dark theme optimized with customizable styles

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `''` | The main title text displayed at the top of the card |
| `description` | `string` | `''` | Plain text description displayed below the title |
| `descriptionRawMarkdown` | `string` | `''` | Markdown formatted description (parsed to HTML) |
| `label` | `string` | `''` | Button label text displayed at the bottom of the card |
| `href` | `string` | `''` | Optional URL to make the card clickable with hover effects |
| `target` | `'_blank' \| '_self'` | `'_self'` | Link target attribute (only applies when href is provided) |
| `variant` | `'default' \| 'outline'` | `'default'` | Card visual variant style |
| `icon` | `string` | `''` | Optional PrimeVue icon class (e.g., 'pi pi-check') |
| `theme` | `'default'` | `'default'` | Visual theme for the card styling |

## Usage

### Basic Card

```vue
<Card
  title="Card Title"
  description="This is a simple card with plain text description."
/>
```

### Card with Markdown

```vue
<Card
  title="Features"
  descriptionRawMarkdown="**Bold text** and *italic text* with [links](https://example.com)"
/>
```

### Outline Variant with Icon

```vue
<Card
  variant="outline"
  icon="pi pi-check"
  title="Success"
  description="Operation completed successfully"
/>
```

### Clickable Card with Link

Cards with `href` automatically display a **linkSecondary** button at the bottom with the label "Learn more" (or a custom label if provided).

```vue
<!-- With default "Learn more" label -->
<Card
  title="Learn More"
  descriptionRawMarkdown="Click to visit our **documentation**"
  href="https://docs.azion.com"
  target="_blank"
/>

<!-- With custom label -->
<Card
  title="Get Started"
  descriptionRawMarkdown="Start building today"
  href="https://console.azion.com"
  label="Start Now"
  target="_blank"
/>
```

### Card in Grid Layout

```vue
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card
    v-for="card in cards"
    :key="card.id"
    :variant="card.variant"
    :icon="card.icon"
    :title="card.title"
    :descriptionRawMarkdown="card.description"
  />
</div>
```

## Variants

### Default
- Clean background with rounded corners
- Hover effect changes background color
- Supports clickable links with smooth transitions

### Outline
- Border with decorative corner dots
- Hover effect on background
- Ideal for feature lists and informational cards

## Technical Details

### PrimeVue Integration

This component uses **PrimeVue Card** in **unstyled mode** with the PassThrough (PT) API for complete style customization:

```vue
<PrimeCard unstyled :pt="defaultCardPT">
  <template #content>
    <!-- Card content -->
  </template>
</PrimeCard>
```

```javascript
// Example PassThrough configuration
const defaultCardPT = {
  root: {
    class: 'w-full h-full bg-neutral-900 rounded-md flex flex-col'
  },
  body: {
    class: 'p-3 md:p-6 flex-1'
  },
  content: {
    class: 'p-0'
  }
}
```

**Benefits of Unstyled Mode:**
- Zero CSS conflicts with existing styles
- Complete control over all styling aspects
- No need to override default PrimeVue styles
- Cleaner DOM output without unused CSS classes

### Markdown Support

The component uses the `parseMarkdown` service to convert markdown to HTML:

- Headers (# ## ###)
- Bold (**text** or __text__)
- Italic (*text* or _text_)
- Links [text](url)
- Line breaks and paragraphs

## Dependencies

- **PrimeVue**: Card component
- **Button**: Custom Button component for card actions
- **markdown-service**: For parsing markdown content

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Link accessibility with target attributes
- Keyboard navigation support (inherited from PrimeVue)

## Responsive Behavior

- Mobile: Single column layout with adjusted padding
- Desktop: Maintains aspect ratio in grid layouts
- Responsive typography with display-5 classes
