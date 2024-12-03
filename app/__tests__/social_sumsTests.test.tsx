import { render } from '@testing-library/react-native';
import AllUsersPropertySummaryPage from '../social_sums'; // Adjust the import path as needed

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

describe('AllUsersPropertySummaryPage', () => {
  test('renders the correct title', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if the title is rendered
    expect(getByText("All Users' Property Summaries")).toBeTruthy();
  });

  test('renders user names correctly', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if user names are rendered
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  test('renders property names correctly', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if property names are rendered
    expect(getByText('Greenwood Estate')).toBeTruthy();
    expect(getByText('Sunnyvale Apartments')).toBeTruthy();
  });

  test('renders project names correctly', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if project names are rendered
    expect(getByText('- Renovation Project')).toBeTruthy();
    expect(getByText('- New Construction')).toBeTruthy();
  });

  test('renders document names correctly', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if document names are rendered
    expect(getByText('- Blueprint.pdf')).toBeTruthy();
    expect(getByText('- BudgetPlan.pdf')).toBeTruthy();
    expect(getByText('- SitePlan.pdf')).toBeTruthy();
  });

  test('correctly renders the data structure', () => {
    const { getByText } = render(<AllUsersPropertySummaryPage />);

    // Check if all data points from the mockUserData array are rendered
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Greenwood Estate')).toBeTruthy();
    expect(getByText('- Renovation Project')).toBeTruthy();
    expect(getByText('- Blueprint.pdf')).toBeTruthy();
    expect(getByText('- BudgetPlan.pdf')).toBeTruthy();

    expect(getByText('Jane Smith')).toBeTruthy();
    expect(getByText('Sunnyvale Apartments')).toBeTruthy();
    expect(getByText('- New Construction')).toBeTruthy();
    expect(getByText('- SitePlan.pdf')).toBeTruthy();
  });
});