import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByText('SetAppointment')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    // Check that navigation items exist (they appear in both desktop and mobile menu)
    expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Portfolio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Testimonials').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Book Now').length).toBeGreaterThan(0);
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    const mobileMenuButton = screen.getByLabelText(/open menu/i);
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('has correct link href attributes in desktop navigation', () => {
    render(<Header />);
    // Get all instances of each link
    const servicesLinks = screen.getAllByText('Services');
    const portfolioLinks = screen.getAllByText('Portfolio');
    const testimonialsLinks = screen.getAllByText('Testimonials');
    const bookNowLinks = screen.getAllByText('Book Now');

    // Check that at least one of each link has the correct href
    expect(servicesLinks[0].closest('a')).toHaveAttribute('href', '#services');
    expect(portfolioLinks[0].closest('a')).toHaveAttribute('href', '#portfolio');
    expect(testimonialsLinks[0].closest('a')).toHaveAttribute('href', '#testimonials');
    expect(bookNowLinks[0].closest('a')).toHaveAttribute('href', '#booking');
  });

  it('opens mobile menu when menu button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    // Check if menu dialog appears
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
