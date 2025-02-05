import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProjectManagement from '../app/project';
import { Alert } from 'react-native';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Firebase Firestore and Auth
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
  }));

jest.mock('../config/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'test-user-id' } }, // Mock user ID
  db: {},
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ProjectManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });




  it('should fetch properties and display them', async () => {
    const mockProperties = [
      { id: '1', street: '123 Main St' },
      { id: '2', street: '456 Oak Ave' },
    ];

    getDocs.mockResolvedValueOnce({
      docs: mockProperties.map((property) => ({
        id: property.id,
        data: () => property,
      })),
    });

    render(<ProjectManagement />);

    // Wait for properties to be rendered
    await waitFor(() => screen.getByText('123 Main St'));
    await waitFor(() => screen.getByText('456 Oak Ave'));

    expect(screen.getByText('123 Main St')).toBeTruthy();
    expect(screen.getByText('456 Oak Ave')).toBeTruthy();
  });




  it('should select a property and fetch associated projects', async () => {
    const mockProperties = [
      { id: '1', street: '123 Main St' },
    ];

    const mockProjects = [
      { id: 'p1', name: 'Project 1', description: 'Description 1', completionDate: '2025-12-31T00:00:00Z' },
    ];

    getDocs
      .mockResolvedValueOnce({
        docs: mockProperties.map((property) => ({
          id: property.id,
          data: () => property,
        })),
      })
      .mockResolvedValueOnce({
        docs: mockProjects.map((project) => ({
          id: project.id,
          data: () => project,
        })),
      });

    render(<ProjectManagement />);

    // Wait for properties to be rendered
    await waitFor(() => screen.getByText('123 Main St'));

    // Select property
    fireEvent.press(screen.getByText('123 Main St'));

    expect(screen.getByText('Project Name:')).toBeTruthy();
    expect(screen.getByText('Project Description:')).toBeTruthy();
  });


/*
  it('should add a project successfully', async () => {
    // Mock properties and project data
    const mockProperties = [{ id: '1', street: '123 Main St' }];
    const mockNewProject = {
        id: 'new-project-id',
        name: 'New Project',
        description: 'New Project Description',
        completionDate: '2025-12-31T00:00:00Z',
    };

    // Mock Firestore calls
    getDocs.mockResolvedValueOnce({
        docs: mockProperties.map((property) => ({
        id: property.id,
        data: () => property,
        })),
    });

    addDoc.mockResolvedValueOnce({
        id: mockNewProject.id,
        ...mockNewProject,
    });

    // Mock AsyncStorage
    AsyncStorage.getItem.mockResolvedValueOnce('1'); // Mock the stored property ID

    render(<ProjectManagement />);

    // Wait for the property list to render
    await waitFor(() => screen.getByText('123 Main St'));

    // Select property
    fireEvent.press(screen.getByText('123 Main St'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith(
        'Property Selected',
        'You selected: undefined'
      ));

    // Wait for the "Add Project" button to appear
    await waitFor(() => screen.getByText('Add Project'));

    // Simulate filling out the project form
    fireEvent.changeText(screen.getByPlaceholderText('Project Name'), 'New Project');
    fireEvent.changeText(screen.getByPlaceholderText('Project Description'), 'New Project Description');

    // Simulate selecting a date (e.g., "2025-12-31")
    fireEvent.press(screen.getByText('Select Completion Date'));
    const mockDate = new Date('2025-12-31');
    const dateTimePickerModal = screen.getByTestId('date-picker-modal');
    fireEvent(dateTimePickerModal, 'onConfirm', mockDate);

    // Add the project
    fireEvent.press(screen.getByText('Add Project'));

    // Wait for success message
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Success!', 'Project added.'));
    });
*/  
});

