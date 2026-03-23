import Button from '@aziontech/webkit/site/button';

export default {
  title: 'Components/Site/Button',
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
      options: ['primary', 'secondary', 'link', 'linkExternal', 'tertiary', 'linkSecondary'],
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
    theme: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color theme',
      defaultValue: 'dark'
    },
    customClass: {
      control: 'text',
      description: 'Custom CSS classes',
      defaultValue: 'px-3 py-3'
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
    }
  }
};

export const Primary = {
  args: {
    label: 'Get Started',
    type: 'primary',
    theme: 'dark'
  }
};

export const PrimaryLight = {
  args: {
    label: 'Get Started',
    type: 'primary',
    theme: 'light'
  }
};

export const Secondary = {
  args: {
    label: 'Learn More',
    type: 'secondary',
    theme: 'dark'
  }
};

export const SecondaryLight = {
  args: {
    label: 'Learn More',
    type: 'secondary',
    theme: 'light'
  }
};

export const Tertiary = {
  args: {
    label: 'Special',
    type: 'tertiary',
    theme: 'dark'
  }
};

export const Link = {
  args: {
    label: 'View Documentation',
    type: 'link',
    href: '/docs',
    theme: 'dark'
  }
};

export const LinkLight = {
  args: {
    label: 'View Documentation',
    type: 'link',
    href: '/docs',
    theme: 'light'
  }
};

export const LinkExternal = {
  args: {
    label: 'External Resource',
    type: 'linkExternal',
    href: 'https://example.com',
    target: '_blank',
    theme: 'dark'
  }
};

export const LinkSecondary = {
  args: {
    label: 'Read More',
    type: 'linkSecondary',
    href: '/blog',
    theme: 'dark'
  }
};

export const SmallSize = {
  args: {
    label: 'Small Button',
    type: 'secondary',
    size: 'small',
    theme: 'dark'
  }
};

export const LargeSize = {
  args: {
    label: 'Large Button',
    type: 'secondary',
    size: 'large',
    theme: 'dark'
  }
};

export const WithIcon = {
  args: {
    label: 'Download',
    type: 'primary',
    icon: 'pi pi-download',
    theme: 'dark'
  }
};

export const SecondaryWithIcon = {
  args: {
    label: 'Settings',
    type: 'secondary',
    icon: 'pi pi-cog',
    theme: 'dark'
  }
};

export const LinkWithIcon = {
  args: {
    label: 'Explore Features',
    type: 'link',
    href: '/features',
    icon: 'pi pi-arrow-right',
    theme: 'dark'
  }
};

export const ButtonAsLink = {
  args: {
    label: 'Navigate',
    type: 'primary',
    href: '/dashboard',
    theme: 'dark'
  }
};

export const CustomStyled = {
  args: {
    label: 'Custom Button',
    type: 'secondary',
    customClass: 'px-6 py-4',
    theme: 'dark'
  }
};
