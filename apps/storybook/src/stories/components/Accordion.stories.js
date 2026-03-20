import Accordion from '@aziontech/webkit/accordion';
import AccordionTab from '@aziontech/webkit/accordion-tab';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    activeIndex: {
      control: 'number',
      description: 'Index of the active tab'
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple tabs to be open simultaneously'
    }
  }
};

export const Default = {
  render: () => ({
    components: { Accordion, AccordionTab },
    template: `
      <Accordion>
        <AccordionTab header="Header I">
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p class="m-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p class="m-0">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.</p>
        </AccordionTab>
      </Accordion>
    `
  })
};

export const Multiple = {
  render: () => ({
    components: { Accordion, AccordionTab },
    template: `
      <Accordion :multiple="true">
        <AccordionTab header="Header I">
          <p class="m-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p class="m-0">Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p class="m-0">At vero eos et accusamus et iusto odio dignissimos ducimus.</p>
        </AccordionTab>
      </Accordion>
    `
  })
};

export const Disabled = {
  render: () => ({
    components: { Accordion, AccordionTab },
    template: `
      <Accordion>
        <AccordionTab header="Header I">
          <p class="m-0">Active tab content.</p>
        </AccordionTab>
        <AccordionTab header="Header II" :disabled="true">
          <p class="m-0">Disabled tab content.</p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p class="m-0">Active tab content.</p>
        </AccordionTab>
      </Accordion>
    `
  })
};
