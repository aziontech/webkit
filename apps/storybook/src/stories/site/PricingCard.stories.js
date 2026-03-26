import PricingCard from '@aziontech/webkit/site/pricing-card';

export default {
  title: '[tech debit] Site to Webkit/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    title: 'Starter',
    subtitle: 'Perfect for small projects and development teams',
    monthlyPrice: '$25',
    annualPrice: '$20',
    currentPeriod: 'monthly',
    priceLabel: 'start at',
    buttonLabel: 'Get Started',
    features: [
      { label: '1TB Bandwidth', icon: 'pi-check' },
      { label: '10 Projects', icon: 'pi-check' },
      { label: 'Basic Analytics', icon: 'pi-check' },
      { label: 'Email Support', icon: 'pi-check' }
    ]
  }
};

export const Popular = {
  args: {
    popular: true,
    title: 'Professional',
    subtitle: 'Ideal for growing businesses and teams',
    monthlyPrice: '$75',
    annualPrice: '$60',
    currentPeriod: 'monthly',
    priceLabel: 'start at',
    buttonLabel: 'Get Started',
    features: [
      { label: '5TB Bandwidth', icon: 'pi-check' },
      { label: 'Unlimited Projects', icon: 'pi-check' },
      { label: 'Advanced Analytics', icon: 'pi-check' },
      { label: 'Priority Support', icon: 'pi-check' },
      { label: 'Custom Domain', icon: 'pi-check' }
    ]
  }
};

export const Annual = {
  args: {
    title: 'Enterprise',
    subtitle: 'For large-scale applications and organizations',
    monthlyPrice: '$150',
    annualPrice: '$120',
    currentPeriod: 'annual',
    priceLabel: 'start at',
    buttonLabel: 'Contact Sales',
    features: [
      { label: 'Unlimited Bandwidth', icon: 'pi-check' },
      { label: 'Unlimited Projects', icon: 'pi-check' },
      { label: 'Real-time Analytics', icon: 'pi-check' },
      { label: '24/7 Support', icon: 'pi-check' },
      { label: 'SLA Guarantee', icon: 'pi-check' }
    ]
  }
};

export const CustomPrice = {
  args: {
    title: 'Custom',
    subtitle: 'Tailored solutions for your specific needs',
    customPrice: 'Contact Us',
    buttonLabel: 'Talk to Sales',
    features: [
      { label: 'Custom Bandwidth', icon: 'pi-check' },
      { label: 'Dedicated Infrastructure', icon: 'pi-check' },
      { label: 'Custom Integration', icon: 'pi-check' },
      { label: 'Dedicated Account Manager', icon: 'pi-check' }
    ]
  }
};

export const WithoutButton = {
  args: {
    title: 'Free Tier',
    subtitle: 'Get started with no commitment',
    monthlyPrice: '$0',
    annualPrice: '$0',
    currentPeriod: 'monthly',
    priceLabel: 'start at',
    buttonHidden: true,
    features: [
      { label: '10GB Bandwidth', icon: 'pi-check' },
      { label: '1 Project', icon: 'pi-check' },
      { label: 'Community Support', icon: 'pi-check' }
    ]
  }
};
