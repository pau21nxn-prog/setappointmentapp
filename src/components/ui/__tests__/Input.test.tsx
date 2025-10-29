import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders correctly with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Input label="Email" helperText="Enter your email address" />);
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
  });

  it('shows required asterisk', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const handleChange = jest.fn();
    render(<Input label="Email" onChange={handleChange} />);

    const input = screen.getByLabelText(/email/i);
    await userEvent.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test@example.com');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeDisabled();
  });

  it('applies error styles when error prop is present', () => {
    render(<Input label="Email" error="Error message" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts custom className', () => {
    render(<Input label="Email" className="custom-input" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('custom-input');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input label="Email" type="email" />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');

    rerender(<Input label="Password" type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });
});
