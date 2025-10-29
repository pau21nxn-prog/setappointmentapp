import React from 'react';
import { render, screen } from '@testing-library/react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card', () => {
  it('renders without crashing', () => {
    render(
      <Card data-testid="card">
        <div>Test content</div>
      </Card>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-white', 'border', 'border-gray-200');
  });

  it('applies outline variant styles', () => {
    render(
      <Card variant="outline" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-2', 'border-gray-300');
  });

  it('applies elevated variant styles', () => {
    render(
      <Card variant="elevated" data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-lg');
  });

  it('applies hover styles when hover prop is true', () => {
    render(
      <Card hover data-testid="card">
        Content
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('hover:shadow-xl', 'hover:-translate-y-1');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders children correctly', () => {
    render(
      <CardHeader>
        <div>Header Content</div>
      </CardHeader>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('applies default padding styles', () => {
    render(<CardHeader data-testid="header">Content</CardHeader>);
    expect(screen.getByTestId('header')).toHaveClass('p-6', 'pb-4');
  });
});

describe('CardTitle', () => {
  it('renders children correctly', () => {
    render(<CardTitle>Title Text</CardTitle>);
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('renders as h3 by default', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders as specified heading level', () => {
    render(<CardTitle as="h2">Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('applies default typography styles', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId('title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
  });
});

describe('CardDescription', () => {
  it('renders children correctly', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<CardDescription data-testid="desc">Text</CardDescription>);
    const desc = screen.getByTestId('desc');
    expect(desc).toHaveClass('mt-1', 'text-sm', 'text-gray-600');
  });
});

describe('CardContent', () => {
  it('renders children correctly', () => {
    render(
      <CardContent>
        <div>Content text</div>
      </CardContent>
    );
    expect(screen.getByText('Content text')).toBeInTheDocument();
  });

  it('applies default padding styles', () => {
    render(<CardContent data-testid="content">Text</CardContent>);
    expect(screen.getByTestId('content')).toHaveClass('p-6', 'pt-4');
  });
});

describe('CardFooter', () => {
  it('renders children correctly', () => {
    render(
      <CardFooter>
        <div>Footer text</div>
      </CardFooter>
    );
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('applies default styles with border', () => {
    render(<CardFooter data-testid="footer">Text</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('p-6', 'pt-4', 'border-t', 'border-gray-100');
  });
});
