import Accordion from '@aziontech/webkit/accordion'
import AccordionTab from '@aziontech/webkit/accordion-tab'

export default {
  title: 'PrimeVue/AccordionTab',
  component: AccordionTab,
  tags: ['autodocs'],
  argTypes: {
    header: { control: 'text', description: 'Header text of the tab' },
    disabled: { control: 'boolean', description: 'Disables the tab' }
  }
}

export const Default = {
  render: () => ({
    components: { Accordion, AccordionTab },
    template: `
      <Accordion>
        <AccordionTab header="Tab 1">
          <p>Content of Tab 1</p>
        </AccordionTab>
        <AccordionTab header="Tab 2">
          <p>Content of Tab 2</p>
        </AccordionTab>
        <AccordionTab header="Tab 3">
          <p>Content of Tab 3</p>
        </AccordionTab>
      </Accordion>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: { Accordion, AccordionTab },
    template: `
      <Accordion>
        <AccordionTab header="Enabled">
          <p>This tab is enabled</p>
        </AccordionTab>
        <AccordionTab header="Disabled" disabled>
          <p>This tab is disabled</p>
        </AccordionTab>
      </Accordion>
    `
  })
}
