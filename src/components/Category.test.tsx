import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Category from './Category';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DataModule from '@/Shared/Data'; // Import the mocked data

// Mock the data source (this is the default mock for all tests in this file)
vi.mock('@/Shared/Data', () => ({
  default: {
    Category: [
      { name: 'TestCategory1', icon: 'icon1.svg' },
      { name: 'TestCategory2', icon: 'icon2.svg' },
    ],
    // Ensure other data properties are included if Category.tsx uses them,
    // or if other tests in other files might indirectly rely on a complete mock.
    // For this component, only Category is used.
    Type: [],
    CarMakes: [],
    Pricing: [],
  },
}));

describe('Category Component', () => {
  let originalCategories: any[];

  beforeEach(() => {
    // Before each test, ensure we know the original state of the mocked categories
    // This is important if a test modifies DataModule.Category directly
    originalCategories = [
        { name: 'TestCategory1', icon: 'icon1.svg' },
        { name: 'TestCategory2', icon: 'icon2.svg' },
      ];
    DataModule.Category = [...originalCategories]; // Reset to default mock
  });

  afterEach(() => {
    // Optional: ensure cleanup after each test if direct manipulation happens.
    // This beforeEach already handles resetting to a known state.
  });

  it('renders the main heading and category items from mocked data', () => {
    render(
      <BrowserRouter>
        <Category />
      </BrowserRouter>
    );

    expect(screen.getByText('Browse By Type')).toBeInTheDocument();
    expect(screen.getByText('TestCategory1')).toBeInTheDocument();
    expect(screen.getByText('TestCategory2')).toBeInTheDocument();
    expect(screen.getByAltText('TestCategory1 category icon')).toBeInTheDocument();
    expect(screen.getByAltText('TestCategory2 category icon')).toBeInTheDocument();

    const link1 = screen.getByText('TestCategory1').closest('a');
    expect(link1).toHaveAttribute('href', '/search/TestCategory1');
    const link2 = screen.getByText('TestCategory2').closest('a');
    expect(link2).toHaveAttribute('href', '/search/TestCategory2');
  });

  it('renders no categories if DataModule.Category is empty', () => {
    // Modify the Category array directly on the imported (mocked) DataModule
    DataModule.Category = [];

    render(
      <BrowserRouter>
        <Category />
      </BrowserRouter>
    );
    expect(screen.getByText('Browse By Type')).toBeInTheDocument();
    expect(screen.queryByText('TestCategory1')).not.toBeInTheDocument();
    expect(screen.queryByText('TestCategory2')).not.toBeInTheDocument();

    // Important: Reset DataModule.Category if other tests might be affected.
    // The beforeEach for the next test will handle this reset.
  });
});
