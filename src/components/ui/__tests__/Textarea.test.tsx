import React from 'react';
import { render, screen } from '@testing-library/react';
import Textarea from '../Textarea';

describe('Textarea', () => {
  it('renders without crashing', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(<Textarea label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Field is required';
    render(<Textarea error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    const helperText = 'Enter your text here';
    render(<Textarea helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it('does not display helper text when error is provided', () => {
    const helperText = 'Helper text';
    const errorMessage = 'Error message';
    render(<Textarea helperText={helperText} error={errorMessage} />);
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('applies error styles when error prop is provided', () => {
    render(<Textarea error="Error" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-red-500');
  });

  it('disables textarea when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets default rows to 4', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('allows custom rows value', () => {
    render(<Textarea rows={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
  });

  it('sets aria-invalid to true when error exists', () => {
    render(<Textarea error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
