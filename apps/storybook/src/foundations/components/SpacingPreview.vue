<script setup>
defineProps({
  /**
   * Spacing token object:
   * { name, category, label, property, description, desktop, tablet, mobile }
   */
  token: { type: Object, required: true },
});

/**
 * Parse a spacing value to get a numeric representation for visualization.
 * Returns the pixel value for display purposes.
 */
function parseValue(value) {
  if (!value) return 0;
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2] || 'px';
  return unit === 'rem' ? num * 16 : num;
}
</script>

<template>
  <div class="spacing-row">
    <div class="meta-col">
      <p class="token-name">{{ token.label }}</p>
      <code class="token-class">.{{ token.name }}</code>
      <p class="token-desc">{{ token.description }}</p>
      
      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">Property</span>
          <span class="spec-value">{{ token.property }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Desktop</span>
          <span class="spec-value highlight">{{ token.desktop }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Tablet</span>
          <span class="spec-value">{{ token.tablet }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Mobile</span>
          <span class="spec-value">{{ token.mobile }}</span>
        </div>
      </div>
    </div>
    
    <div class="preview-col">
      <div class="preview-box">
        <div 
          v-if="token.property === 'max-width'"
          class="max-width-demo"
          :style="{ maxWidth: token.desktop }"
        >
          <span class="demo-label">max-width</span>
        </div>
        
        <div 
          v-else-if="token.property.includes('padding')"
          class="padding-demo"
          :style="{ padding: token.desktop }"
        >
          <div class="padding-inner">
            <span class="demo-label">{{ token.desktop }}</span>
          </div>
        </div>
        
        <div 
          v-else-if="token.property === 'gap'"
          class="gap-demo"
          :style="{ gap: token.desktop }"
        >
          <div class="gap-item" />
          <div class="gap-item" />
          <div class="gap-item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spacing-row {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-subtle, #1e1e1e);
  align-items: flex-start;
}

.spacing-row:last-child {
  border-bottom: none;
}

.meta-col {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.token-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-default, #eee);
  margin: 0;
}

.token-class {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  background: rgba(254, 96, 31, 0.07);
  border: 1px solid rgba(254, 96, 31, 0.15);
  color: var(--text-primary, #fe601f);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.token-desc {
  font-size: 12px;
  color: var(--text-muted, #888);
  margin: 0 0 8px;
  line-height: 1.5;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.spec-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #666);
}

.spec-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 10px;
  color: var(--text-muted, #888);
}

.spec-value.highlight {
  color: var(--text-primary, #fe601f);
}

.preview-col {
  flex: 1;
  min-width: 0;
}

.preview-box {
  background: var(--background-surface, rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-default, #2a2a2a);
  border-radius: 8px;
  padding: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.max-width-demo {
  background: rgba(254, 96, 31, 0.15);
  border: 2px dashed var(--border-primary, #fe601f);
  border-radius: 4px;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-label {
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  color: var(--text-muted, #888);
}

.padding-demo {
  background: rgba(138, 132, 236, 0.15);
  border-radius: 4px;
}

.padding-inner {
  background: var(--background-surface, #1a1a1a);
  border-radius: 2px;
  padding: 8px 12px;
  min-width: 60px;
  text-align: center;
}

.gap-demo {
  display: flex;
  width: 100%;
}

.gap-item {
  flex: 1;
  height: 32px;
  background: rgba(34, 197, 94, 0.3);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .spacing-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .meta-col {
    flex: none;
    width: 100%;
  }
}
</style>
