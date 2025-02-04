import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProjectManagement from '../app/project';
import api from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve(null)),
    deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock API Calls
jest.mock('../API/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) =>
    render(ui, { wrapper: SafeAreaProvider });

describe('ProjectManagement Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders ProjectManagement component correctly', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

        const { findByText } = renderWithProviders(<ProjectManagement />);
        
        await act(async () => {
            await waitFor(() => expect(findByText('Select a Property:')).toBeTruthy(), { timeout: 10000 });
        });
    }, 15000);

    it('fetches and displays properties', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({
            data: [{ property_id: 1, name: 'Luxury Villa' }]
        });

        const { findByText } = renderWithProviders(<ProjectManagement />);

        await act(async () => {
            await waitFor(() => expect(findByText('Luxury Villa')).toBeTruthy(), { timeout: 10000 });
        });
    }, 15000);

    it('allows selecting a property and fetches its projects', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url === '/properties') {
                return Promise.resolve({ data: [{ property_id: 1, name: 'Luxury Villa' }] });
            }
            if (url.startsWith('/projects')) {
                return Promise.resolve({
                    data: [{ project_id: 101, name: 'Renovation', description: 'New pool', completion_date: '2024-12-31' }]
                });
            }
            return Promise.resolve({ data: [] });
        });

        const { findByText } = renderWithProviders(<ProjectManagement />);

        let property;
        await act(async () => {
            property = await waitFor(() => findByText('Luxury Villa'), { timeout: 10000 });
            expect(property).toBeTruthy();
        });

        fireEvent.press(property!);

        await act(async () => {
            await waitFor(() => expect(findByText('Projects for Luxury Villa:')).toBeTruthy(), { timeout: 10000 });
            expect(findByText('Renovation - Tue Dec 31 2024')).toBeTruthy();
        });
    }, 15000);

    it('allows adding a new project', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url === '/properties') {
                return Promise.resolve({ data: [{ property_id: 1, name: 'Luxury Villa' }] });
            }
            if (url.startsWith('/projects')) {
                return Promise.resolve({ data: [] });
            }
            return Promise.resolve({ data: [] });
        });

        (api.post as jest.Mock).mockResolvedValueOnce({
            data: { project_id: 102, name: 'Garden Upgrade', description: 'Add new trees', completion_date: '2025-01-15' }
        });

        const { findByText, getByPlaceholderText } = renderWithProviders(<ProjectManagement />);

        let property;
        await act(async () => {
            property = await waitFor(() => findByText('Luxury Villa'), { timeout: 10000 });
            expect(property).toBeTruthy();
        });

        fireEvent.press(property!);

        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Project Name'), 'Garden Upgrade');
            fireEvent.changeText(getByPlaceholderText('Project Description'), 'Add new trees');
            fireEvent.press(await findByText('Add Project'));
        });

        await act(async () => {
            await waitFor(() => expect(findByText('Garden Upgrade - Wed Jan 15 2025')).toBeTruthy(), { timeout: 10000 });
        });
    }, 15000);

    it('handles API failures gracefully', async () => {
        (api.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        const { findByText } = renderWithProviders(<ProjectManagement />);

        await act(async () => {
            await waitFor(() => expect(findByText('Error!', { exact: false })).toBeTruthy(), { timeout: 10000 });
        });
    }, 15000);
});
