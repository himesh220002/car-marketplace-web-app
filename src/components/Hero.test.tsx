import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { describe, it, expect, vi } from 'vitest';

// Mock the Search component
vi.mock('./Search', () => ({
  default: () => <div data-testid="mocked-search">Mocked Search Component</div>,
}));

describe('Hero Component', () => {
  it('renders headings, images, and the mocked Search component', () => {
    render(<Hero />);

    // Check for headings
    expect(screen.getByText('Find Your Dream Car')).toBeInTheDocument();
    expect(screen.getByText('Find cars for sale and for rent near you.')).toBeInTheDocument();

    // Check for the mocked Search component
    expect(screen.getByTestId('mocked-search')).toBeInTheDocument();
    expect(screen.getByText('Mocked Search Component')).toBeInTheDocument();

    // Check for images by alt text
    expect(screen.getByAltText('BMW car')).toBeInTheDocument();
    expect(screen.getByAltText('Animated car illustration')).toBeInTheDocument();
  });

  it('applies correct styling for background image', () => {
    const { container } = render(<Hero />);
    const heroSectionDiv = container.querySelector('.hero-section-snap'); // Class added in component for this div

    expect(heroSectionDiv).toBeInTheDocument();
    if (heroSectionDiv) { // TypeScript guard
      // Check for inline style for background image. Note: this can be brittle.
      // It's generally better to test the outcome of styles (e.g., visibility, layout) than specific style properties.
      // However, for a background image central to the component, it's a reasonable check.
      expect(heroSectionDiv).toHaveStyle("background-image: url('/digital-art-1.jpg')");
      expect(heroSectionDiv).toHaveStyle("background-size: cover");
      expect(heroSectionDiv).toHaveStyle("background-position: bottom");
    }
  });
});
