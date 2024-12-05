import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainMenu from '../app/main'; // Update the path to your component
import { useRouter } from 'expo-router';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MainMenu Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    // Mock the useRouter hook to return pushMock
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  test('renders Main Menu title and buttons', () => {
    const { getByText } = render(<MainMenu />);

    // Check if the "Main Menu" text is rendered
    expect(getByText('Main Menu')).toBeTruthy(); // Checks if Main Menu text is rendered

    // Check if the buttons are rendered
    expect(getByText('Add a New Property')).toBeTruthy();
    expect(getByText('Add a New Project')).toBeTruthy();
    expect(getByText('Add an Invoice/Receipt')).toBeTruthy();
    expect(getByText('Property Summary')).toBeTruthy();
    expect(getByText('Community Property Summaries')).toBeTruthy();
  });

  test('navigates to the correct page when a button is pressed', () => {
    const { getByText } = render(<MainMenu />);

    // Simulate the button presses
    fireEvent.press(getByText('Add a New Property'));
    expect(pushMock).toHaveBeenCalledWith('/property');

    fireEvent.press(getByText('Add a New Project'));
    expect(pushMock).toHaveBeenCalledWith('/project');

    fireEvent.press(getByText('Add an Invoice/Receipt'));
    expect(pushMock).toHaveBeenCalledWith('/document');

    fireEvent.press(getByText('Property Summary'));
    expect(pushMock).toHaveBeenCalledWith('/property_summary');

    fireEvent.press(getByText('Community Property Summaries'));
    expect(pushMock).toHaveBeenCalledWith('/listing_summaries');
  });
});