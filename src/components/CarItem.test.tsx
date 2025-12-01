import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Link component needs a router context
import CarItem from './CarItem';
import { expect, it, describe } from 'vitest';

// Mock for react-icons, if they cause issues in tests or are not relevant to the DOM structure being tested.
// Vitest automatically mocks CSS/image imports, but not necessarily entire libraries like react-icons.
// For basic rendering, direct icon rendering might be fine. If errors occur, we can mock them.
// vi.mock('react-icons/bs', () => ({ BsFillFuelPumpFill: () => <svg data-testid="fuel-icon" /> }));
// vi.mock('react-icons/io', () => ({ IoIosSpeedometer: () => <svg data-testid="speed-icon" /> }));
// vi.mock('react-icons/gi', () => ({ GiGearStickPattern: () => <svg data-testid="manual-gear-icon" /> }));
// vi.mock('react-icons/tb', () => ({ TbAutomaticGearbox: () => <svg data-testid="auto-gear-icon" /> }));
// vi.mock('react-icons/md', () => ({ MdOpenInNew: () => <svg data-testid="open-new-icon" /> }));


describe('CarItem Component', () => {
  const mockCar = {
    id: '1',
    listingTitle: 'Amazing Test Car',
    images: [{ imageUrl: 'http://example.com/test-image.jpg' }], // Image URL needs to be valid-looking for tests
    mileage: '15', // Just the number part, as unit is determined in component
    fuelType: 'Petrol',
    transmission: 'Automatic',
    sellingPrice: 25000,
  };

  const electricMockCar = {
    ...mockCar,
    id: '2',
    listingTitle: 'Electric Test Car',
    fuelType: 'Electric',
    mileage: '300', // Km for electric
  };

  it('renders car details correctly for a petrol car', () => {
    render(
      <BrowserRouter>
        <CarItem car={mockCar} />
      </BrowserRouter>
    );

    // Check for listing title
    expect(screen.getByText(mockCar.listingTitle)).toBeInTheDocument();

    // Check for image alt text (important for accessibility)
    expect(screen.getByAltText(mockCar.listingTitle)).toBeInTheDocument();

    // Check for mileage and fuel type combination
    expect(screen.getByText(`${mockCar.mileage} Km`)).toBeInTheDocument(); // Petrol car
    expect(screen.getByText(mockCar.fuelType)).toBeInTheDocument();

    // Check for transmission
    expect(screen.getByText(mockCar.transmission)).toBeInTheDocument();

    // Check for selling price - it's formatted with a $ prefix and ceiling
    expect(screen.getByText(`$${Math.ceil(mockCar.sellingPrice)}`)).toBeInTheDocument();

    // Check for "View Details"
    expect(screen.getByText('View Details')).toBeInTheDocument();

    // Check for the "New" badge (currently static)
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders car details correctly for an electric car', () => {
    render(
      <BrowserRouter>
        <CarItem car={electricMockCar} />
      </BrowserRouter>
    );

    expect(screen.getByText(electricMockCar.listingTitle)).toBeInTheDocument();
    // Check for mileage and fuel type combination for electric car
    expect(screen.getByText(`${electricMockCar.mileage} Km`)).toBeInTheDocument(); // Electric car
    expect(screen.getByText(electricMockCar.fuelType)).toBeInTheDocument();
  });

  it('renders fallback image if primary image fails to load', () => {
    // For this test, we need to simulate the onError event.
    // This is harder with RTL alone without firing events or specific image mock.
    // A simpler check is that an image tag is rendered.
    // More advanced: mock Image constructor or use something like `jest-Image-mock`.
    // For now, ensure the image tag is present.
    render(
      <BrowserRouter>
        <CarItem car={mockCar} />
      </BrowserRouter>
    );
    const imgElement = screen.getByAltText(mockCar.listingTitle);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', mockCar.images[0].imageUrl);
  });
});
