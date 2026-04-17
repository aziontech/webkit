import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Base frontmatter schema shared across all page types
 */
const baseSchema = z.object({
  /** Optional explicit id (e.g. "foundations/index") to avoid duplicate id warnings when same path exists in multiple locales */
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  // Navigation metadata
  navLabel: z.string().optional(),
  order: z.number().optional(),
  hidden: z.boolean().optional(),
  category: z.string().optional(),
  // Status metadata
  status: z.enum(['stable', 'beta', 'deprecated', 'planned', 'experimental']).optional(),
  since: z.string().optional(),
  deprecatedIn: z.string().optional(),
  contributors: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date().optional(),
  // Tags for search/categorization
  tags: z.array(z.string()).optional(),
  // Version and Language (i18n support)
  version: z.string().default('v1'),
  language: z.string().default('en'),
  // Translation metadata
  translatedFrom: z.string().optional(), // Original language if translated
  translationStatus: z.enum(['complete', 'partial', 'missing']).optional(),
});

/**
 * Anatomy part definition
 */
const anatomyPartSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
});

/**
 * Keyboard interaction definition
 */
const keyboardInteractionSchema = z.object({
  keys: z.string(),
  action: z.string(),
});

/**
 * ARIA attribute definition
 */
const ariaAttributeSchema = z.object({
  attribute: z.string(),
  usage: z.string(),
});

/**
 * Accessibility metadata schema
 */
const accessibilitySchema = z.object({
  keyboard: z.array(keyboardInteractionSchema).optional(),
  aria: z.array(ariaAttributeSchema).optional(),
  wcag: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

/**
 * Prop definition for API documentation
 */
const propDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  default: z.string().optional(),
  required: z.boolean().optional(),
  description: z.string(),
});

/**
 * Slot definition for API documentation
 */
const slotDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  props: z.string().optional(),
});

/**
 * Event definition for API documentation
 */
const eventDefinitionSchema = z.object({
  name: z.string(),
  payload: z.string().optional(),
  description: z.string(),
});

/**
 * Do/Don't item for usage guidelines
 */
const doDontItemSchema = z.object({
  type: z.enum(['do', 'dont']),
  description: z.string(),
  example: z.string().optional(),
});

/**
 * Example definition for usage documentation
 */
const usageExampleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  code: z.string(),
  preview: z.string().optional(),
});

/**
 * Usage guidelines schema
 */
const usageSchema = z.object({
  whenToUse: z.array(z.string()).optional(),
  whenNotToUse: z.array(z.string()).optional(),
  doDonts: z.array(doDontItemSchema).optional(),
  examples: z.array(usageExampleSchema).optional(),
});

/**
 * Component documentation schema
 */
const componentSchema = baseSchema.extend({
  type: z.literal('component'),
  category: z.enum(['form', 'navigation', 'feedback', 'data-display', 'layout', 'utility']).optional(),
  component: z.string().optional(),
  source: z.string().optional(),
  storybook: z.string().optional(),
  figma: z.string().optional(),
  related: z.array(z.string()).optional(),
  /**
   * Key for auto-loading API data from generated/component-api/<apiFrom>.json.
   * When set and the `api` field is absent, the layout resolves props/slots/events
   * from the generated JSON instead of requiring them in frontmatter.
   */
  apiFrom: z.string().optional(),
  // Structured anatomy
  anatomy: z.array(anatomyPartSchema).optional(),
  // Structured accessibility
  accessibility: accessibilitySchema.optional(),
  // Usage guidelines (for Usage tab)
  usage: usageSchema.optional(),
  // API documentation (can be manual or generated)
  api: z.object({
    props: z.array(propDefinitionSchema).optional(),
    slots: z.array(slotDefinitionSchema).optional(),
    events: z.array(eventDefinitionSchema).optional(),
  }).optional(),
});

/**
 * Foundation documentation schema
 */
const foundationSchema = baseSchema.extend({
  type: z.literal('foundation'),
  category: z.enum(['color', 'typography', 'spacing', 'elevation', 'motion', 'imagery']).optional(),
});

/**
 * Token documentation schema
 */
const tokenSchema = baseSchema.extend({
  type: z.literal('token'),
  category: z.enum(['color', 'typography', 'spacing', 'elevation', 'motion', 'border', 'shadow']),
});

/**
 * Block documentation schema
 */
const blockSchema = baseSchema.extend({
  type: z.literal('block'),
  category: z.string(),
  components: z.array(z.string()).optional(),
  // Optional usage and API (same structure as component) for block detail pages
  usage: usageSchema.optional(),
  api: z.object({
    props: z.array(propDefinitionSchema).optional(),
    slots: z.array(slotDefinitionSchema).optional(),
    events: z.array(eventDefinitionSchema).optional(),
  }).optional(),
});

/**
 * Pattern documentation schema
 */
const patternSchema = baseSchema.extend({
  type: z.literal('pattern'),
  category: z.string(),
  useCases: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
});

/**
 * Template documentation schema
 */
const templateSchema = baseSchema.extend({
  type: z.literal('template'),
  category: z.string(),
  blocks: z.array(z.string()).optional(),
});

/**
 * Getting started guide schema
 */
const guideSchema = baseSchema.extend({
  type: z.literal('guide'),
  category: z.enum(['installation', 'quick-start', 'migration', 'contribution']).optional(),
  prerequisites: z.array(z.string()).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

/**
 * Icon documentation schema
 */
const iconSchema = baseSchema.extend({
  type: z.literal('icon'),
  category: z.enum(['azionicons', 'primeicons']).optional(),
});

/**
 * Contributing documentation schema
 */
const contributingSchema = baseSchema.extend({
  type: z.literal('contributing'),
  category: z.enum(['guidelines', 'development', 'documentation', 'pull-requests']).optional(),
});

/**
 * Playground documentation schema
 */
const playgroundSchema = baseSchema.extend({
  type: z.literal('playground'),
});

/**
 * Content schema - union of all types for v1 content
 */
const v1ContentSchema = z.discriminatedUnion('type', [
  componentSchema,
  foundationSchema,
  tokenSchema,
  blockSchema,
  patternSchema,
  templateSchema,
  guideSchema,
  iconSchema,
  contributingSchema,
  playgroundSchema,
]);

/**
 * Define all content collections
 * 
 * Phase 2 structure: Content is organized in v1/en and v1/pt folders
 * Each language folder contains all content types (components, foundations, etc.)
 */
export const collections = {
  // v1 English content
  'v1-en': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/v1/en' }),
    schema: v1ContentSchema,
  }),
  // v1 Portuguese content
  'v1-pt': defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/v1/pt' }),
    schema: v1ContentSchema,
  }),
};

/**
 * Export types for frontmatter
 */
export type ComponentFrontmatter = z.infer<typeof componentSchema>;
export type FoundationFrontmatter = z.infer<typeof foundationSchema>;
export type TokenFrontmatter = z.infer<typeof tokenSchema>;
export type BlockFrontmatter = z.infer<typeof blockSchema>;
export type PatternFrontmatter = z.infer<typeof patternSchema>;
export type TemplateFrontmatter = z.infer<typeof templateSchema>;
export type GuideFrontmatter = z.infer<typeof guideSchema>;
export type IconFrontmatter = z.infer<typeof iconSchema>;
export type ContributingFrontmatter = z.infer<typeof contributingSchema>;
export type PlaygroundFrontmatter = z.infer<typeof playgroundSchema>;

export type ComponentFrontmatterWithApiFrom = ComponentFrontmatter & { apiFrom?: string };

// Export sub-types for convenience
export type AnatomyPart = z.infer<typeof anatomyPartSchema>;
export type KeyboardInteraction = z.infer<typeof keyboardInteractionSchema>;
export type AriaAttribute = z.infer<typeof ariaAttributeSchema>;
export type AccessibilityMetadata = z.infer<typeof accessibilitySchema>;
export type PropDefinition = z.infer<typeof propDefinitionSchema>;
export type SlotDefinition = z.infer<typeof slotDefinitionSchema>;
export type EventDefinition = z.infer<typeof eventDefinitionSchema>;
export type DoDontItem = z.infer<typeof doDontItemSchema>;
export type UsageExample = z.infer<typeof usageExampleSchema>;
export type UsageMetadata = z.infer<typeof usageSchema>;
