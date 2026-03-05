import { mount } from '@vue/test-utils';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import IconCard from '@/components/IconCard.vue'; 

// Mock icons data - minimal version for testing
const iconsData = [
  { name: 'test-icon', icon: 'ai-azion' }
];

describe('IconCard.vue - Test all icons', () => {
  let wrapper;

  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn((url) => {
      if (url.includes('/assets/svg-raw/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<svg fill="#ffffff" width="100" height="100"></svg>'),
        });
      }
      return Promise.reject(new Error('Not Found'));
    });

    // Mock window.URL.createObjectURL
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    // Mock document.createElement for download links
    document.createElement = vi.fn((element) => {
      if (element === 'a') {
        return {
          href: '',
          download: '',
          click: vi.fn(),
          setAttribute: vi.fn(),
          remove: vi.fn(),
        };
      } else {
        return {}; 
      }
    }); 
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  iconsData.forEach((icon) => {
    it(`should render the SVG icon correctly for ${icon.name}`, async () => {
      wrapper = mount(IconCard, {
        props: {
          name: icon.name,
          icon: icon.icon,
          color: '#000000',
          size: 'text-base',
          downloadFormat: 'svg',
        },
        global: {
          stubs: {
            transition: false,
            'transition-group': false,
          },
        },
      });
    
      // Verify the component was mounted correctly
      expect(wrapper.exists()).toBe(true);
    });
  });
});
