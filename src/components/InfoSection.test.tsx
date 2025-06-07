import { render, screen } from '@testing-library/react';
import InfoSection from './InfoSection';
import { describe, it, expect } from 'vitest';

describe('InfoSection Component', () => {
  it('renders the static content correctly', () => {
    render(<InfoSection />);

    // Check for the heading
    expect(screen.getByText('Koenigsegg Agera RS: A Hypercar Beyond Limits')).toBeInTheDocument();

    // Check for a part of the paragraph text
    // Using a regex for partial match, ignoring case, and handling potential whitespace differences
    expect(screen.getByText(/The Koenigsegg Agera RS is a rare masterpiece/i)).toBeInTheDocument();

    // Check for the image by its alt text
    const image = screen.getByAltText('Koenigsegg Agera RS');
    expect(image).toBeInTheDocument();

    // Optionally, check the image source if it's critical and stable
    expect(image).toHaveAttribute('src', 'https://res.cloudinary.com/dbcx5bxea/image/upload/v1747133820/Car-marketplace/cyzomwr0104gdel52q9t.webp');
  });
});
