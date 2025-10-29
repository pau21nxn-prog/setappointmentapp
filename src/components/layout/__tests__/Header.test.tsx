import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />);
    expect(screen.getByText('SetAppointment')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    const mobileMenuButton = screen.getByLabelText(/open menu/i);
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('has correct link href attributes', () => {
    render(<Header />);
    expect(screen.getByText('Services').closest('a')).toHaveAttribute('href', '#services');
    expect(screen.getByText('Portfolio').closest('a')).toHaveAttribute('href', '#portfolio');
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '#about');
    expect(screen.getByText('Book Now').closest('a')).toHaveAttribute('href', '#booking');
  });
});
