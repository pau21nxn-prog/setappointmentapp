import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders without crashing', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Badge>Badge Content</Badge>);
    expect(screen.getByText('Badge Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Badge data-testid="badge">Default</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('applies success variant styles', () => {
    render(
      <Badge variant="success" data-testid="badge">
        Success
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('applies warning variant styles', () => {
    render(
      <Badge variant="warning" data-testid="badge">
        Warning
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  it('applies error variant styles', () => {
    render(
      <Badge variant="error" data-testid="badge">
        Error
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('applies info variant styles', () => {
    render(
      <Badge variant="info" data-testid="badge">
        Info
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('applies outline variant styles', () => {
    render(
      <Badge variant="outline" data-testid="badge">
        Outline
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('border-2', 'border-gray-300', 'bg-transparent');
  });

  it('applies small size styles', () => {
    render(
      <Badge size="sm" data-testid="badge">
        Small
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
  });

  it('applies medium size styles by default', () => {
    render(<Badge data-testid="badge">Medium</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
  });

  it('applies large size styles', () => {
    render(
      <Badge size="lg" data-testid="badge">
        Large
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
  });

  it('applies custom className', () => {
    render(
      <Badge className="custom-class" data-testid="badge">
        Custom
      </Badge>
    );
    expect(screen.getByTestId('badge')).toHaveClass('custom-class');
  });

  it('renders as a span element', () => {
    const { container } = render(<Badge>Badge</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
