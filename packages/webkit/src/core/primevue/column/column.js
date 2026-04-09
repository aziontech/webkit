// Direct re-export of PrimeVue Column for DataTable compatibility
// DataTable internally identifies Column children by component type,
// so wrapping breaks the detection mechanism
export { default } from 'primevue/column'
