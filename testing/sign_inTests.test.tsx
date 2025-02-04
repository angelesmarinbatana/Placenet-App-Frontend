import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../app/sign_in'; // Adjust the import path if needed
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => () => ({
  signInWithEmailAndPassword: jest.fn((email, password) => 
    Promise.resolve({ user: { uid: '12345', email } })
  ),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock SecureStore methods
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn().mockResolvedValue('mockToken')
}));

// Mock SafeAreaView for tests
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

describe('LoginPage Component', () => {
  let pushMock: jest.Mock;
  let mockAuth: any;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    mockAuth = require('@react-native-firebase/auth')();
    jest.clearAllMocks()
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

  /*test('navigates to sign_up page when Sign Up link is clicked', () => {
    const { getByText } = render(<LoginPage />);

    // Simulate clicking the "Sign Up" text
    fireEvent.press(getByText('Sign Up'));

    // Check if the router navigates to the sign_up page
    expect(pushMock).toHaveBeenCalledWith('/sign_up');
  });*/
});
