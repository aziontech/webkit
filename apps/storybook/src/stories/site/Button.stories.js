import Button from '@aziontech/webkit/site/button';

export default {
  title: 'TODO -  Marketing to Webkit/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label text'
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Button size',
      defaultValue: 'large'
    },
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'link'],
      description: 'Button type/variant',
      defaultValue: 'secondary'
    },
    href: {
      control: 'text',
      description: 'Link URL (renders as anchor tag when provided)'
    },
    icon: {
      control: 'text',
      description: 'Icon class (e.g., pi pi-check)'
    },
    customClass: {
      control: 'text',
      description: 'Custom CSS classes (default: px-0 py-0)',
      defaultValue: 'px-0 py-0'
    },
    target: {
      control: 'select',
      options: ['_blank', '_self'],
      description: 'Link target',
      defaultValue: '_self'
    },
    location: {
      control: 'text',
      description: 'Analytics location identifier',
      defaultValue: 'cta'
    },
    onClick: {
      action: 'click',
      description: 'Click event handler'
    }
  }
};

export const Primary = {
  args: {
    label: 'Get Started',
    type: 'primary',
    customClass: 'px-3 py-3'
  }
};

export const Secondary = {
  args: {
    label: 'Learn More',
    type: 'secondary',
    customClass: 'px-3 py-3'
  }
};

export const Link = {
  args: {
    label: 'View Documentation',
    type: 'link',
    href: '/docs'
  }
};

export const SmallSize = {
  args: {
    label: 'Small Button',
    type: 'secondary',
    size: 'small',
    customClass: 'px-3 py-3'
  }
};

export const LargeSize = {
  args: {
    label: 'Large Button',
    type: 'secondary',
    size: 'large',
    customClass: 'px-3 py-3'
  }
};

export const WithIcon = {
  args: {
    label: 'Download',
    type: 'primary',
    icon: 'pi pi-download',
    customClass: 'px-3 py-3'
  }
};

export const SecondaryWithIcon = {
  args: {
    label: 'Settings',
    type: 'secondary',
    icon: 'pi pi-cog',
    customClass: 'px-3 py-3'
  }
};

export const LinkWithIcon = {
  args: {
    label: 'Explore Features',
    type: 'link',
    href: '/features',
    icon: 'pi pi-arrow-right'
  }
};

export const ButtonAsLink = {
  args: {
    label: 'Navigate',
    type: 'primary',
    href: '/dashboard',
    customClass: 'px-3 py-3'
  }
};

export const CustomStyled = {
  args: {
    label: 'Custom Button',
    type: 'secondary',
    customClass: 'px-6 py-4'
  }
};
