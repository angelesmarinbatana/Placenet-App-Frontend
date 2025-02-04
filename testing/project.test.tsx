import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ProjectManagement from '../app/project';
import api from '../API/api';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock API
jest.mock('../API/api');

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
  }));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>, // Just render children without the SafeArea logic
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ProjectManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    render(<ProjectManagement />);

    // Check for initial text
    expect(screen.getByText('Select a Property:')).toBeTruthy();
  });

  it('should fetch properties and display them', async () => {
    const mockProperties = [
      { property_id: 1, name: 'Property 1' },
      { property_id: 2, name: 'Property 2' },
    ];

    api.get.mockResolvedValueOnce({ data: mockProperties });

    render(<ProjectManagement />);

    // Wait for properties to be rendered
    await waitFor(() => screen.getByText('Property 1'));
    await waitFor(() => screen.getByText('Property 2'));

    expect(screen.getByText('Property 1')).toBeTruthy();
    expect(screen.getByText('Property 2')).toBeTruthy();
  });

  it('should show an error when failing to fetch properties', async () => {
    api.get.mockRejectedValueOnce(new Error('Failed to fetch properties'));

    render(<ProjectManagement />);

    // Wait for error message to appear
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Error!', 'Failed to fetch properties.'));
  });

  it('should select a property and fetch projects for that property', async () => {
    const mockProperties = [{ property_id: 1, name: 'Property 1' }];
    const mockProjects = [
      { project_id: 1, name: 'Project 1', description: 'Description 1', completion_date: '2025-12-31T00:00:00Z' },
    ];

    api.get.mockResolvedValueOnce({ data: mockProperties });  // Fetch properties
    api.get.mockResolvedValueOnce({ data: mockProjects });    // Fetch projects

    AsyncStorage.getItem.mockResolvedValueOnce('1');  // Mock the stored property ID

    render(<ProjectManagement />);

    // Wait for property to appear
    await waitFor(() => screen.getByText('Property 1'));

    // Select property
    fireEvent.press(screen.getByText('Property 1'));

    // Check if the projects for the property are displayed
    await waitFor(() => screen.getByText('Project 1 - Tue Dec 30 2025'));
    expect(screen.getByText('Project 1 - Tue Dec 30 2025')).toBeTruthy();
  });

  it('should add a project successfully', async () => {
    const mockProperties = [{ property_id: 1, name: 'Property 1' }];
    const mockNewProject = {
      project_id: 1,
      name: 'New Project',
      description: 'New Project Description',
      completion_date: '2025-12-31T00:00:00Z',
    };

    api.get.mockResolvedValueOnce({ data: mockProperties });  // Fetch properties
    api.post.mockResolvedValueOnce({ data: mockNewProject });  // Add new project

    AsyncStorage.getItem.mockResolvedValueOnce('1');  // Mock the stored property ID

    render(<ProjectManagement />);

    await waitFor(() => screen.getByText('Property 1'));

    // Select property
    fireEvent.press(screen.getByText('Property 1'));

    // Fill in project details
    fireEvent.changeText(screen.getByPlaceholderText('Project Name'), 'New Project');
    fireEvent.changeText(screen.getByPlaceholderText('Project Description'), 'New Project Description');

    // Mock the date picker behavior (set the date)
    fireEvent.press(screen.getByText('Select Completion Date'));
    
    const mockDate = new Date('2025-12-31');
    const dateTimePickerModal = screen.getByTestId('date-picker-modal'); // Assume the modal has testID='date-picker-modal'
    fireEvent(dateTimePickerModal, 'onConfirm', mockDate);

    // Add project
    fireEvent.press(screen.getByText('Add Project'));

    // Wait for success message
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Success!', 'Project has been added!'));
  });

  /*it('should show error message if required fields are missing when adding a project', async () => {
    render(<ProjectManagement />);

    // Select property
    fireEvent.press(screen.getByText('Property 1'));

    // Try adding project without filling in the fields
    fireEvent.press(screen.getByText('Add Project'));

    // Expect an alert with an error message
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please select a property, fill out all project fields, and choose a completion date.'));
  });

  it('should update a project successfully', async () => {
    const mockProperties = [{ property_id: 1, name: 'Property 1' }];
    const mockUpdatedProject = {
      project_id: 1,
      name: 'Updated Project',
      description: 'Updated Description',
      completion_date: '2025-12-31T00:00:00Z',
    };

    api.get.mockResolvedValueOnce({ data: mockProperties });
    api.post.mockResolvedValueOnce({ data: mockUpdatedProject });

    AsyncStorage.getItem.mockResolvedValueOnce('1');

    render(<ProjectManagement />);

    await waitFor(() => screen.getByText('Property 1'));

    // Select property and load projects
    fireEvent.press(screen.getByText('Property 1'));

    // Set up the form to edit an existing project (this will simulate editing behavior)
    fireEvent.press(screen.getByText('Project 1')); // Assuming project exists
    fireEvent.changeText(screen.getByPlaceholderText('Project Name'), 'Updated Project');
    fireEvent.changeText(screen.getByPlaceholderText('Project Description'), 'Updated Description');

    // Simulate date selection
    fireEvent.press(screen.getByText('Select Completion Date'));
    fireEvent.press(screen.getByText('2025-12-31'));

    // Update project
    fireEvent.press(screen.getByText('Update Project'));

    // Check success alert
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Success!', 'Project has been updated!'));
  });

  it('should delete a project successfully', async () => {
    const mockProperties = [{ property_id: 1, name: 'Property 1' }];
    const mockProjectToDelete = {
      project_id: 1,
      name: 'Project to Delete',
      description: 'Description',
      completion_date: '2025-12-31T00:00:00Z',
    };

    api.get.mockResolvedValueOnce({ data: mockProperties });
    api.delete.mockResolvedValueOnce({});

    AsyncStorage.getItem.mockResolvedValueOnce('1');

    render(<ProjectManagement />);

    await waitFor(() => screen.getByText('Property 1'));

    // Select property and load projects
    fireEvent.press(screen.getByText('Property 1'));



    await waitFor(() => screen.getByText('Update Project'));

    fireEvent.press(screen.getByText('Delete'));

    // Wait for success alert
    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Deleted!', 'Project has been removed.'));
  });*/
});
