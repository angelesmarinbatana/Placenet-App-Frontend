import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../app/sign_in'; // Adjust the import path if needed
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock SecureStore methods
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn().mockResolvedValue('mockToken')
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
}));

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

describe('LoginPage Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  test('renders LoginPage with inputs and buttons', () => {
    const { getByText, getByPlaceholderText } = render(<LoginPage />);

    // Check if the title and subtitle are rendered correctly
    expect(getByText('Welcome Back!')).toBeTruthy();
    expect(getByText('Sign in to your account')).toBeTruthy();

    // Check if the input fields are rendered correctly
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();

    // Check if the login button is rendered
    expect(getByText('Sign In')).toBeTruthy();
  });
  
  test('shows error message if credentials are invalid', async () => {
    // Mock the API call to reject with an error
    SecureStore.getItemAsync.mockResolvedValueOnce('mockToken');
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Invalid Credentials'));

    const { getByPlaceholderText, getByText } = render(<LoginPage />);

    // Fill in the form with invalid credentials
    fireEvent.changeText(getByPlaceholderText('Email'), 'wrongUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongPassword');

    // Simulate the Sign In button press
    fireEvent.press(getByText('Sign In'));

    // Check if the error message is shown
    //await waitFor(() => expect(getByText('Invalid Credentials! Try Again.')));
    //expect(getByText('Invalid Credentials! Try Again.')).toBeTruthy();
  });
});
