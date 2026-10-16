import { markRaw } from 'vue'

import ImageProcessorEventsFragment from '../../ui/mockup/widgets/ImageProcessorEventsFragment.vue'
import ImageProcessorModuleFragment from '../../ui/mockup/widgets/ImageProcessorModuleFragment.vue'
import ImageProcessorRuleFragment from '../../ui/mockup/widgets/ImageProcessorRuleFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-globe',
    title: 'Fast image delivery worldwide',
    description:
      "Optimize and serve images through Azion's distributed architecture so pages load faster across devices, browsers, and locations."
  },
  {
    icon: 'pi pi-arrow-right-arrow-left',
    title: 'Automatic format and size optimization',
    description:
      'Resize, compress, and convert images to WebP, AVIF, or fallback formats on demand without building manual variant pipelines.'
  },
  {
    icon: 'pi pi-database',
    title: 'No separate image storage required',
    description:
      'Keep source assets in your existing origin and transform them by URL, avoiding upload workflows, duplicated files, and extra media infrastructure.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shopping-cart',
    title: 'E-commerce product image optimization',
    description:
      'Optimize product images for faster page loads and better conversion rates. Automatically deliver responsive images at the right size and format for each device.',
    href: '/site/solutions/retail'
  },
  {
    icon: 'pi pi-book',
    title: 'News and media site responsive images',
    description:
      'Deliver optimized images for news articles and media content that load instantly on any device. Automatic format conversion ensures the best experience.',
    href: '/site/solutions/streaming'
  },
  {
    icon: 'pi pi-upload',
    title: 'User-generated content optimization',
    description:
      'Optimize user-uploaded images on-the-fly from your storage. Apply consistent sizing, quality, and format standards without preprocessing.',
    href: '/site/solutions/technology'
  },
  {
    icon: 'ai ai-edge-storage',
    title: 'Static site and Jamstack image handling',
    description:
      'Integrate image optimization into static site builds. Transform images on demand from your static hosting without build-time preprocessing.',
    href: '/site/solutions/web-apps'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Image Processor?',
    answer:
      'Azion Image Processor is a real-time image optimization service that transforms images on demand from any HTTP-accessible origin. Key features include: automatic WebP/AVIF conversion based on browser support, on-the-fly resizing and compression via URL parameters, no separate storage requirement, support for JPEG/PNG/GIF/BMP/ICO formats, and up to 80% file size reduction. It improves Core Web Vitals without storing multiple image versions.'
  },
  {
    value: 'vs-uploads',
    question: 'How does Image Processor differ from services that require image uploads?',
    answer:
      'Image Processor transforms images directly from your existing origin—object storage, web server, or CDN—without requiring you to upload images to a separate service. This means you maintain control over your source images, avoid storage costs, and can work with images from multiple origins without migration.'
  },
  {
    value: 'resize',
    question: 'How do I resize an image with Image Processor?',
    answer:
      'Resize by adding an ims query string with width and height in pixels, using the format ims=WidthxHeight. You can also use fit-in/WidthxHeight to fit the image into a bounding box while preserving aspect ratio.'
  },
  {
    value: 'aspect-ratio',
    question: 'Can I preserve aspect ratio when resizing?',
    answer:
      'Yes. Provide only one dimension (using ims=Widthx or ims=xHeight) and Image Processor calculates the other dimension automatically to preserve aspect ratio.'
  },
  {
    value: 'formats',
    question: 'Which image formats are supported?',
    answer:
      'Image Processor supports JPEG, GIF, PNG, BMP, ICO, WebP, and AVIF. Input formats can be converted to any supported output format via the ims parameter. WebP and AVIF delivery depends on browser support when using automatic format detection.'
  },
  {
    value: 'webp-avif',
    question: 'How do I convert an image to WebP or AVIF?',
    answer:
      'Use a format filter in the ims parameter to convert to webp or avif. For example, image.jpg?ims=webp converts a JPEG to WebP. For automatic format selection based on browser support, enable format conversion in your configuration and Image Processor will deliver the optimal format based on Accept headers.'
  },
  {
    value: 'limits',
    question: 'What are the default processing limits?',
    answer:
      'The default limits are a maximum image size of 150 MB, maximum width of 3840 pixels, and maximum height of 2160 pixels. These limits can be adjusted based on your subscription plan.'
  },
  {
    value: 'chained-transformations',
    question: 'Can I apply multiple transformations in a single request?',
    answer:
      'Yes. You can chain multiple filters inside the ims parameter, combining operations like resizing, quality adjustment, rotation, and format conversion in one URL. For example, image.jpg?ims=800x600:quality=85:webp resizes, adjusts quality, and converts format simultaneously.'
  },
  {
    value: 'caching',
    question: 'How does caching work with Image Processor?',
    answer:
      'Transformed images are cached according to cache policies you configure via Rules Engine in Applications. This allows you to balance freshness with performance, keeping frequently-requested transformed images cached at global points of presence for faster delivery.'
  },
  {
    value: 'measure-impact',
    question: 'How can I measure the impact of image optimization?',
    answer:
      'Monitor traffic savings by tracking bandwidth reduction metrics in Real-Time Metrics, comparing processed images against original transfers over time. You can also observe Core Web Vitals improvements through your preferred analytics tools.'
  },
  {
    value: 'cloudflare-migration',
    question: 'Can I migrate from Cloudflare Images to Image Processor?',
    answer:
      "Yes. Since Image Processor works with any origin, you can download your images from Cloudflare Images, host them at your preferred storage location, and configure Image Processor to transform them on demand. Update your image URLs to use Azion's ims query parameter format."
  },
  {
    value: 'origin-down',
    question: 'What happens if my origin is unavailable?',
    answer:
      'Image Processor requires access to your origin to fetch the source image. If your origin is temporarily unavailable, the transformation request will fail. Consider using Azion Cache with appropriate TTLs to serve cached transformed images during origin downtime.'
  }
]

export const IMAGE_PROCESSOR_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Image Processor',
    title: 'Optimize images on demand',
    description:
      'Transform images in real-time with automatic WebP/AVIF conversion. Reduce file sizes by up to 80% without separate storage.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Image optimization inside the application',
    description:
      'Image Processor is a module of the application: switch it on, point a rule at your images, and follow every processed request in Real-Time Events.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-image-processor',
        title: 'From source images to optimized delivery',
        description:
          'Image Processor transforms existing origin images into optimized variants for modern web delivery. Switch the module on in the application that serves them.',
        scene: { component: markRaw(ImageProcessorModuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-rules-engine',
        title: 'Rules that decide which images are optimized',
        description:
          'Match image paths in Rules Engine and apply Optimize Images. Transformed images are cached by the cache policies you configure.',
        scene: { component: markRaw(ImageProcessorRuleFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-real-time-events',
        title: 'Every processed image in Real-Time Events',
        description:
          'Follow each request that processed an image, with the ims parameters it carried, its status and the bytes sent.',
        scene: { component: markRaw(ImageProcessorEventsFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'URL-based transformations without API complexity',
        description:
          'Perform dynamic image transformations on demand via URL query parameters. Adapt dimensions, aspect ratio, quality, and format to each context—browser, screen size, or network conditions—without managing API calls or variant configurations.',
        href: PRODUCT_DOCS,
        illustration: 'content-and-media-delivery',
        illustrationLabel: 'A page frame beside tiles for the video, image and audio it delivers',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Multi-format optimization with automatic detection',
        description:
          'Automatically adjust format, resolution, and quality based on browser and device while preserving visual fidelity and minimizing file size. Support for JPEG, PNG, GIF, BMP, ICO, WebP, and AVIF with intelligent format selection.',
        href: '/site/products/cache',
        illustration: 'content-and-media-delivery-globe',
        illustrationLabel: 'A globe serving video, image and audio to every region',
        actions: [{ label: 'Cache', href: '/site/products/cache' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'See how to use',
    description:
      'Put Image Processor in front of any origin and serve optimized images from Azion’s distributed infrastructure, transformed by URL. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('contabilizei') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
