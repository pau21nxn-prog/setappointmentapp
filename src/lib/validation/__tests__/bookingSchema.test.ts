import {
  personalInfoSchema,
  projectDetailsSchema,
  schedulingSchema,
  bookingFormSchema,
} from '../bookingSchema';

describe('Personal Info Schema', () => {
  it('validates correct personal info data', () => {
    const validData = {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company_name: 'Tech Corp',
      industry: 'technology',
      website_url: 'https://example.com',
      current_website: true,
    };

    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const invalidData = {
      full_name: 'John Doe',
      email: 'invalid-email',
      phone: '1234567890',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('rejects short name', () => {
    const invalidData = {
      full_name: 'J',
      email: 'john@example.com',
      phone: '1234567890',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('rejects invalid phone number', () => {
    const invalidData = {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '123',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('accepts empty website URL', () => {
    const validData = {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company_name: 'Tech Corp',
      industry: 'technology',
      website_url: '',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });
});

describe('Project Details Schema', () => {
  it('validates correct project details data', () => {
    const validData = {
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      budget_range: '5k-10k',
      timeline: '1-2-months',
      features: ['contact-forms', 'blog'],
      additional_notes: 'Looking forward to working together',
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(validData)).not.toThrow();
  });

  it('rejects short project description', () => {
    const invalidData = {
      project_type: 'new-website',
      project_description: 'Too short',
      budget_range: '5k-10k',
      timeline: '1-2-months',
      features: ['contact-forms'],
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(invalidData)).toThrow();
  });

  it('rejects empty features array', () => {
    const invalidData = {
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      budget_range: '5k-10k',
      timeline: '1-2-months',
      features: [],
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(invalidData)).toThrow();
  });

  it('accepts empty additional notes', () => {
    const validData = {
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      budget_range: '5k-10k',
      timeline: '1-2-months',
      features: ['contact-forms'],
      additional_notes: '',
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(validData)).not.toThrow();
  });
});

describe('Scheduling Schema', () => {
  it('validates correct scheduling data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const validData = {
      preferred_date: tomorrowStr,
      preferred_time: '10am-11am',
      timezone: 'America/New_York',
    };

    expect(() => schedulingSchema.parse(validData)).not.toThrow();
  });

  it('rejects past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const invalidData = {
      preferred_date: yesterdayStr,
      preferred_time: '10am-11am',
      timezone: 'America/New_York',
    };

    expect(() => schedulingSchema.parse(invalidData)).toThrow();
  });

  it('accepts today as preferred date', () => {
    const today = new Date().toISOString().split('T')[0];

    const validData = {
      preferred_date: today,
      preferred_time: '10am-11am',
      timezone: 'America/New_York',
    };

    expect(() => schedulingSchema.parse(validData)).not.toThrow();
  });
});

describe('Complete Booking Form Schema', () => {
  it('validates complete booking form data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const validData = {
      // Personal Info
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company_name: 'Tech Corp',
      industry: 'technology',
      website_url: 'https://example.com',
      current_website: true,
      // Project Details
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      budget_range: '5k-10k',
      timeline: '1-2-months',
      features: ['contact-forms', 'blog'],
      additional_notes: 'Looking forward to working together',
      referral_source: 'google-search',
      // Scheduling
      preferred_date: tomorrowStr,
      preferred_time: '10am-11am',
      timezone: 'America/New_York',
    };

    expect(() => bookingFormSchema.parse(validData)).not.toThrow();
  });

  it('rejects incomplete booking form data', () => {
    const invalidData = {
      full_name: 'John Doe',
      email: 'john@example.com',
      // Missing required fields
    };

    expect(() => bookingFormSchema.parse(invalidData)).toThrow();
  });
});
