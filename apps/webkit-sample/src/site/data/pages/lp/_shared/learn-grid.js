const LEARN_ICONS = ['pi pi-book', 'pi pi-bullseye', 'pi pi-sparkles', 'pi pi-user']

export const learnGrid = (items, heading = {}) => ({
  section: 'CapabilityGrid',
  ...heading,
  columns: 4,
  items: items.map((item, index) => ({ icon: LEARN_ICONS[index], ...item }))
})
