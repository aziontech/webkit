import PricingCard from '@aziontech/webkit/pricing-card';

const defaultFeatures = [
  { icon: 'pi-check', label: 'Unlimited rules engine' },
  { icon: 'pi-check', label: 'Global edge deployment' },
  { icon: 'pi-check', label: 'Advanced observability' },
  { icon: 'pi-check', label: '24/7 support' }
];

export default {
  title: 'Core/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  argTypes: {
    popular: {
      control: 'boolean',
      description: 'Displays the Popular badge'
    },
    pupularText: {
      control: 'text',
      description: 'Popular badge label'
    },
    title: {
      control: 'text',
      description: 'Main plan title'
    },
    subtitle: {
      control: 'text',
      description: 'Plan description'
    },
    features: {
      control: 'object',
      description: 'Feature list with icon and label'
    },
    monthlyPrice: {
      control: 'text',
      description: 'Monthly billing price'
    },
    annualPrice: {
      control: 'text',
      description: 'Annual billing price'
    },
    currentPeriod: {
      control: 'select',
      options: ['monthly', 'annual'],
      description: 'Current billing period'
    },
    priceLabel: {
      control: 'text',
      description: 'Price helper text'
    },
    customPrice: {
      control: 'text',
      description: 'Custom text replacing numeric price'
    },
    buttonLabel: {
      control: 'text',
      description: 'Call-to-action label'
    },
    buttonLink: {
      control: 'text',
      description: 'CTA destination URL'
    },
    buttonTarget: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'CTA target behavior'
    },
    buttonHidden: {
      control: 'boolean',
      description: 'Hides the CTA area'
    }
  }
};

export const Default = {
  args: {
    popular: false,
    pupularText: 'Popular',
    title: 'Pro',
    subtitle: 'For teams scaling edge applications fast.',
    features: defaultFeatures,
    monthlyPrice: '$49',
    annualPrice: '$39',
    currentPeriod: 'monthly',
    priceLabel: 'start at',
    buttonLabel: 'Get Started',
    buttonLink: '#',
    buttonTarget: '_self',
    customPrice: '',
    buttonHidden: false
  }
};

export const Popular = {
  args: {
    ...Default.args,
    popular: true,
    title: 'Business'
  }
};

export const AnnualBilling = {
  args: {
    ...Default.args,
    currentPeriod: 'annual'
  }
};

export const CustomPrice = {
  args: {
    ...Default.args,
    title: 'Enterprise',
    customPrice: 'Contact us',
    buttonLabel: 'Talk to Sales'
  }
};

export const WithoutButton = {
  args: {
    ...Default.args,
    buttonHidden: true
  }
};
