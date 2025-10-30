import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '../MobileMenu';

describe('MobileMenu', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders without crashing when open', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not show menu when isOpen is false', () => {
    render(<MobileMenu isOpen={false} onClose={mockOnClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('translate-x-full');
  });

  it('shows menu when isOpen is true', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('translate-x-0');
  });

  it('displays menu title', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement;
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when a navigation link is clicked', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const servicesLink = screen.getByText('Services');
    fireEvent.click(servicesLink);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays copyright text with current year', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('has correct navigation link hrefs', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const servicesLink = screen.getByText('Services').closest('a');
    const portfolioLink = screen.getByText('Portfolio').closest('a');
    const testimonialsLink = screen.getByText('Testimonials').closest('a');
    const bookNowLink = screen.getByText('Book Now').closest('a');

    expect(servicesLink).toHaveAttribute('href', '#services');
    expect(portfolioLink).toHaveAttribute('href', '#portfolio');
    expect(testimonialsLink).toHaveAttribute('href', '#testimonials');
    expect(bookNowLink).toHaveAttribute('href', '#booking');
  });

  it('applies special styling to Book Now button', () => {
    render(<MobileMenu isOpen={true} onClose={mockOnClose} />);
    const bookNowLink = screen.getByText('Book Now').closest('a');
    expect(bookNowLink).toHaveClass('bg-gradient-to-r', 'from-emerald-500');
  });
});
