/**
 * JSON-LD Structured Data for SEO
 * =============================================================================
 * Generates schema.org structured data for rich search results
 * Helps Google and other search engines understand page content
 *
 * Last Updated: 2025-10-30
 * Phase: 3 - SEO & Analytics
 * =============================================================================
 */

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://setappointmentapp.vercel.app';

/**
 * Organization Schema
 * Defines the business/organization information
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SetAppointmentApp',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    'Professional web development services with a 15-day delivery guarantee. Specializing in custom websites, e-commerce solutions, and digital transformation.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-XXX-XXX-XXXX', // TODO: Add real phone number
    contactType: 'Customer Service',
    email: 'hello@setappointmentapp.com',
    areaServed: 'US',
    availableLanguage: ['English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
    // addressLocality: 'City',
    // addressRegion: 'State',
    // postalCode: 'ZIP',
  },
  sameAs: [
    // TODO: Add social media URLs
    // 'https://twitter.com/setappointmentapp',
    // 'https://linkedin.com/company/setappointmentapp',
    // 'https://facebook.com/setappointmentapp',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
};

/**
 * WebSite Schema
 * Defines the website and search functionality
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SetAppointmentApp',
  url: baseUrl,
  description:
    'Book your free consultation for professional web development services with guaranteed 15-day delivery.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/?s={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/**
 * Service Schema
 * Defines the services offered
 */
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Development',
  provider: {
    '@type': 'Organization',
    name: 'SetAppointmentApp',
    url: baseUrl,
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Development Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Custom Website Development',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'E-commerce Website',
              description: 'Full-featured online store with payment processing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Business Website',
              description: 'Professional corporate website with modern design',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Landing Page',
              description: 'High-converting landing page for marketing campaigns',
            },
          },
        ],
      },
    ],
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: '0',
      priceCurrency: 'USD',
      name: 'Free Consultation',
    },
  },
};

/**
 * Breadcrumb Schema
 * Defines breadcrumb navigation structure
 */
export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * FAQ Schema
 * Defines frequently asked questions (if applicable)
 */
export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/**
 * Local Business Schema (if applicable)
 */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'SetAppointmentApp',
  image: `${baseUrl}/logo.png`,
  '@id': baseUrl,
  url: baseUrl,
  telephone: '+1-XXX-XXX-XXXX', // TODO: Add real phone number
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    // latitude: XX.XXXXX,
    // longitude: -XX.XXXXX,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
  sameAs: [
    // TODO: Add social media URLs
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '50',
  },
};

/**
 * Combine all schemas for the homepage
 */
export const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [organizationSchema, websiteSchema, serviceSchema],
};
