import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'web-design',
    title: 'Web Design',
    description:
      'Custom, responsive designs that capture your brand identity and engage your audience across all devices.',
    icon: 'Palette',
    features: [
      'Custom UI/UX Design',
      'Responsive Layouts',
      'Brand Identity Integration',
      'Mobile-First Approach',
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description:
      'Modern, scalable web applications built with cutting-edge technologies and best practices.',
    icon: 'Code',
    features: [
      'React & Next.js Development',
      'TypeScript Implementation',
      'API Integration',
      'Performance Optimization',
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Solutions',
    description:
      'Complete online store solutions with secure payment processing and inventory management.',
    icon: 'ShoppingCart',
    features: [
      'Shopping Cart Functionality',
      'Payment Gateway Integration',
      'Product Management',
      'Order Tracking System',
    ],
  },
  {
    id: 'web-applications',
    title: 'Web Applications',
    description:
      'Custom web applications tailored to your business needs with intuitive user interfaces.',
    icon: 'Layout',
    features: [
      'Custom Dashboard Development',
      'Database Design & Integration',
      'User Authentication',
      'Real-time Features',
    ],
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    description: 'Improve your search engine rankings and drive organic traffic to your website.',
    icon: 'TrendingUp',
    features: [
      'On-Page SEO',
      'Technical SEO Audit',
      'Content Optimization',
      'Performance Monitoring',
    ],
  },
  {
    id: 'maintenance',
    title: 'Website Maintenance',
    description:
      'Ongoing support and maintenance to keep your website secure, updated, and performing optimally.',
    icon: 'Settings',
    features: ['Regular Updates', 'Security Monitoring', 'Bug Fixes', '24/7 Technical Support'],
  },
];
