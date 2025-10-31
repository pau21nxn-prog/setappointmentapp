// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.EMAIL_FROM = 'noreply@test.com';
process.env.EMAIL_ADMIN = 'admin@test.com';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
