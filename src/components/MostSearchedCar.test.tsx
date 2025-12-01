import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, hoisted } from 'vitest'; // Import hoisted

// --- Define Mocks Content using vi.hoisted for variables used in hoisted vi.mock factories ---
const { mockDb, mockDbResult_actual } = vi.hoisted(() => { // Renamed mockDbResult to avoid conflict if any
  const dbResultData = [
    { carListing: { id: 'dbCar1', listingTitle: 'DB Car 1' }, carImages: { imageUrl: 'dbImg1.jpg'} },
    { carListing: { id: 'dbCar2', listingTitle: 'DB Car 2' }, carImages: { imageUrl: 'dbImg2.jpg'} },
  ];
  const dbMockInstance = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(dbResultData),
  };
  return { mockDb: dbMockInstance, mockDbResult_actual: dbResultData };
});

const { mockFormattedCars_actual } = vi.hoisted(() => { // Using hoisted for this as well for consistency
    return {
        mockFormattedCars_actual: [
            { id: 'car1', listingTitle: 'Formatted Mocked Car 1', images: [{imageUrl: 'img1.jpg'}], mileage: '10', fuelType: 'Petrol', transmission: 'Manual', sellingPrice: 10000 },
            { id: 'car2', listingTitle: 'Formatted Mocked Car 2', images: [{imageUrl: 'img2.jpg'}], mileage: '20', fuelType: 'Electric', transmission: 'Automatic', sellingPrice: 20000 },
        ]
    };
});


// --- vi.mock calls AFTER defining mock content ---
vi.mock('./../../configs', () => ({
  db: mockDb, // mockDb is now from vi.hoisted, guaranteed to be initialized
}));

vi.mock('@/Shared/Service', async (importOriginal) => {
  const originalModule = await importOriginal() as any;
  return {
    ...originalModule,
    default: {
      ...originalModule.default,
      FormatResult: vi.fn(() => mockFormattedCars_actual),
    },
  };
});

vi.mock('./CarItem', () => ({
  default: ({ car }: { car: any }) => (
    <div data-testid={`car-item-${car.id}`}>
      <p>{car.listingTitle}</p>
    </div>
  ),
}));

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, className }: { children: React.ReactNode, className?: string }) => <div data-testid="carousel" className={className}>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children, className }: { children: React.ReactNode, className?: string }) => <div data-testid="carousel-item" className={className}>{children}</div>,
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="carousel-previous">Previous</button>,
}));

// --- Import the component to be tested AFTER mocks are set up ---
import MostSearchedCar from './MostSearchedCar';

// --- Tests ---
describe('MostSearchedCar Component', () => {
  let ServiceMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    ServiceMock = (await import('@/Shared/Service')).default;
    // Reset to default behavior using the constant from vi.hoisted
    (ServiceMock.FormatResult as ReturnType<typeof vi.fn>).mockImplementation(() => mockFormattedCars_actual);
    mockDb.limit.mockResolvedValue(mockDbResult_actual);
  });

  it('renders the heading and fetches and displays cars', async () => {
    render(
      <BrowserRouter>
        <MostSearchedCar />
      </BrowserRouter>
    );

    expect(screen.getByText('Most Searched Car')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Formatted Mocked Car 1')).toBeInTheDocument();
      expect(screen.getByTestId('car-item-car1')).toBeInTheDocument();
    });

    expect(screen.getByText('Formatted Mocked Car 2')).toBeInTheDocument();
    expect(screen.getByTestId('car-item-car2')).toBeInTheDocument();

    expect(mockDb.select).toHaveBeenCalled();
    expect(ServiceMock.FormatResult).toHaveBeenCalledWith(mockDbResult_actual);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-item').length).toBe(mockFormattedCars_actual.length);
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
  });

  it('renders no cars if fetched list is empty', async () => {
    (ServiceMock.FormatResult as ReturnType<typeof vi.fn>).mockImplementation(() => []);
    mockDb.limit.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <MostSearchedCar />
      </BrowserRouter>
    );

    expect(screen.getByText('Most Searched Car')).toBeInTheDocument();

    await waitFor(() => {
      expect(ServiceMock.FormatResult).toHaveBeenCalled();
    });

    expect(screen.queryByText('Formatted Mocked Car 1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('car-item-car1')).not.toBeInTheDocument();
  });
});
