import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the company name', () => {
    render(<Footer />);
    expect(screen.getByText('SetAppointment')).toBeInTheDocument();
  });

  it('renders the company description', () => {
    render(<Footer />);
    expect(
      screen.getByText(/professional web development consultation services/i)
    ).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getAllByText('Services')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Portfolio')[0]).toBeInTheDocument();
    expect(screen.getAllByText('About')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Book Now')[0]).toBeInTheDocument();
  });

  it('renders contact section', () => {
    render(<Footer />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('contact@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (234) 567-890')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} SetAppointment`))).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('has correct href attributes for links', () => {
    render(<Footer />);
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    const termsLink = screen.getByText('Terms of Service').closest('a');

    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });
});
