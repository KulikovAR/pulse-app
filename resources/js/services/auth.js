import axios from 'axios';

export const telegramAuth = {
    async login() {
        try {
            // Mock user data for testing
            const mockUser = {
                id: 12345670,
                username: 'test_user',
                first_name: 'Test Client User',
                phone: '77777777777',
                auth_date: Math.floor(Date.now() / 1000),
                hash: 'mock_hash_value'
            };

            const response = await axios.post('/telegram/login', mockUser);

            console.log(response);
            
            if (response.data.data && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                return response.data.data;
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};