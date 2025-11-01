import {
  personalInfoSchema,
  projectDetailsSchema,
  schedulingSchema,
  bookingFormSchema,
} from '../bookingSchema';

describe('Personal Info Schema', () => {
  it('validates correct personal info data', () => {
    const validData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      industry_other: '',
      website_url: 'https://example.com',
      current_website: true,
    };

    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const invalidData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'invalid-email',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('rejects short first name', () => {
    const invalidData = {
      first_name: 'J',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('rejects short last name', () => {
    const invalidData = {
      first_name: 'John',
      last_name: 'D',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('rejects empty phone number', () => {
    const invalidData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '',
      company_name: 'Tech Corp',
      industry: 'technology',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it('accepts empty website URL', () => {
    const validData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      industry_other: '',
      website_url: '',
      current_website: false,
    };

    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it('accepts industry_other when industry is "other"', () => {
    const validData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'other',
      industry_other: 'Custom Industry',
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
      features: ['contact-forms'],
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(invalidData)).toThrow();
  });

  it('rejects empty features array', () => {
    const invalidData = {
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      features: [],
      referral_source: 'google-search',
    };

    expect(() => projectDetailsSchema.parse(invalidData)).toThrow();
  });

  it('accepts empty additional notes', () => {
    const validData = {
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
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
      preferred_time: 'morning',
      video_call_platform: 'zoom',
    };

    expect(() => schedulingSchema.parse(validData)).not.toThrow();
  });

  it('rejects past dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const invalidData = {
      preferred_date: yesterdayStr,
      preferred_time: 'morning',
      video_call_platform: 'zoom',
    };

    expect(() => schedulingSchema.parse(invalidData)).toThrow();
  });

  it('accepts today as preferred date', () => {
    const today = new Date().toISOString().split('T')[0];

    const validData = {
      preferred_date: today,
      preferred_time: 'afternoon',
      video_call_platform: 'google-meet',
    };

    expect(() => schedulingSchema.parse(validData)).not.toThrow();
  });

  it('validates all time options', () => {
    const today = new Date().toISOString().split('T')[0];

    ['morning', 'afternoon', 'night'].forEach((time) => {
      const validData = {
        preferred_date: today,
        preferred_time: time,
        video_call_platform: 'zoom',
      };
      expect(() => schedulingSchema.parse(validData)).not.toThrow();
    });
  });

  it('validates all video call platforms', () => {
    const today = new Date().toISOString().split('T')[0];

    ['zoom', 'google-meet', 'webex', 'other'].forEach((platform) => {
      const validData = {
        preferred_date: today,
        preferred_time: 'morning',
        video_call_platform: platform,
      };
      expect(() => schedulingSchema.parse(validData)).not.toThrow();
    });
  });
});

describe('Complete Booking Form Schema', () => {
  it('validates complete booking form data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const validData = {
      // Personal Info
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+12345678901',
      company_name: 'Tech Corp',
      industry: 'technology',
      industry_other: '',
      website_url: 'https://example.com',
      current_website: true,
      // Project Details
      project_type: 'new-website',
      project_description: 'We need a modern website for our business',
      features: ['contact-forms', 'blog'],
      additional_notes: 'Looking forward to working together',
      referral_source: 'google-search',
      // Scheduling
      preferred_date: tomorrowStr,
      preferred_time: 'morning',
      video_call_platform: 'zoom',
    };

    expect(() => bookingFormSchema.parse(validData)).not.toThrow();
  });

  it('rejects incomplete booking form data', () => {
    const invalidData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      // Missing required fields
    };

    expect(() => bookingFormSchema.parse(invalidData)).toThrow();
  });
});
