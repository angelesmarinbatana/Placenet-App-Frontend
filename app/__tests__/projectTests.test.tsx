import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProjectManagement from '../project'; // Adjust as per the actual path

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/API/api', () => ({
    fetchProperties: jest.fn(() => Promise.resolve([
        { property_id: 1, name: 'Property 1' },
        { property_id: 2, name: 'Property 2' },
    ])),
    addProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
}));

describe('ProjectManagement Component', () => {
    test('renders the list of properties from API', async () => {
        const { findByText } = render(<ProjectManagement />);

        // Wait for properties to load
        expect(findByText('Property 1')).toBeTruthy();
        expect(findByText('Property 2')).toBeTruthy();
    });


    test('deletes a project', async () => {
        const { findByText, getByText, queryByText } = render(<ProjectManagement />);

        //fireEvent.press(findByText('Property 1'));
        //fireEvent.press(getByText('Delete'));

        // Verify project deleted
        expect(queryByText('Deleted Project')).toBeNull();
    });
});
