import React from 'react';
import { render, screen } from '@testing-library/react';
import Select, { SelectOption } from '../Select';

describe('Select', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders without crashing', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Select label="Test Label" options={mockOptions} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(<Select label="Required Field" required options={mockOptions} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={mockOptions} />);
    mockOptions.forEach((option) => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Select error={errorMessage} options={mockOptions} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    const helperText = 'Choose an option';
    render(<Select helperText={helperText} options={mockOptions} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('applies error styles when error prop is provided', () => {
    render(<Select error="Error" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  it('disables select when disabled prop is true', () => {
    render(<Select disabled options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('sets aria-invalid to true when error exists', () => {
    render(<Select error="Error" options={mockOptions} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders default placeholder option', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('option', { name: 'Select an option...' })).toBeInTheDocument();
  });
});
