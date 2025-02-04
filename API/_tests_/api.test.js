import axios from 'axios';
import api from '../api';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

jest.mock('axios', () => {
    const mockAxios = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
            request: {
                use: jest.fn((onFulfilled) => {
                    mockAxios.requestInterceptor = onFulfilled; 
                     
                }),
            },
            response: {
                use: jest.fn((onFulfilled, onRejected) => {
                    mockAxios.responseInterceptor = onRejected;  
                }),
            },
        },
    };
    return {
        create: jest.fn(() => mockAxios),
    };
});

describe('API Utility Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create API instance with baseURL', () => {
        expect(api).toBeDefined();
    });

    it('should add token to request headers if available', async () => {
        SecureStore.getItemAsync.mockResolvedValue('fake-jwt-token');

        // Simulate calling the interceptor
        const config = { headers: {} };
        await axios.create().requestInterceptor(config);

        expect(config.headers.Authorization).toBe('Bearer fake-jwt-token');
    });

    it('should delete the token if API returns 401 or 403', async () => {
        SecureStore.deleteItemAsync.mockResolvedValue(null);

        const error = {
            response: { status: 401 },  // Simulate expired token response
            config: { _retry: false },  // Ensure the retry flag is set
        };

        try {
            await axios.create().responseInterceptor(error);
        } catch (e) {
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('userToken');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('userId');
        }
    });
});
