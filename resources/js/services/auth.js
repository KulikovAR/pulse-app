import axios from 'axios';

export const telegramAuth = {
    async login() {
        try {
            // Mock user data for testing
            // const mockUser = {
            //     id: 12345670,
            //     username: 'test_user',
            //     first_name: 'Test Client User',
            //     phone: '+77777777777',
            //     auth_date: Math.floor(Date.now() / 1000),
            //     hash: 'mock_hash_value'
            // };

            // Send mock user data to the server for authentication
            // const initData = new URLSearchParams(window.Telegram.WebApp.initData);

            const initData = window.Telegram.WebApp.initData;
            console.log('Raw initData:', initData);
            Telegram.WebApp.showAlert(`Raw initData: ${JSON.stringify(initData)}`);


            // const userData = {
            //     id: JSON.parse(initData.get('user')).id,
            //     username: JSON.parse(initData.get('user')).username,
            //     first_name: JSON.parse(initData.get('user')).first_name,
            //     auth_date: initData.get('auth_date'),
            //     hash: initData.get('hash'),
            //     phone: Telegram.WebApp.initDataUnsafe.user?.phone || null
            // };

            // const response = await axios.post('/telegram/login', mockUser);
            // const response = await window.axios.post('/telegram/login', userData);
            const response = await window.axios.post('/telegram/login', initData);
            console.log('Auth response:', response);
            
            if (response.data.data && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                this.$router.push({ name: 'confirm-phone' });
            } else {
                Telegram.WebApp.showAlert('Invalid response from server');
                throw new Error('Invalid response from server');
            }
            
            Telegram.WebApp.showAlert('Invalid response from server');
            throw new Error('Invalid response from server');
        } catch (error) {
            const errorDetails = {
                message: error.message,
                code: error.code || 'N/A',
                status: error.response?.status || 'No status',
                responseData: error.response?.data || 'No response data',
                config: {
                    url: error.config?.url,
                    baseURL: error.config?.baseURL || window.axios.defaults.baseURL,
                    method: error.config?.method,
                    data: error.config?.data
                },
                fullURL: (error.config?.baseURL || window.axios.defaults.baseURL) + (error.config?.url || '')
            };

            console.error('Authentication error details:', errorDetails);
            
            const mainError = `Error ${errorDetails.status}:\nMethod: ${errorDetails.config.method?.toUpperCase()}\nFull URL: ${errorDetails.fullURL}\nServer response: ${JSON.stringify(errorDetails.responseData)}`;

            Telegram.WebApp.showAlert(mainError);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    async requestPhone() {
        try {
            const result = await new Promise((resolve) => {
                Telegram.WebApp.requestContact(resolve);
            });
            
            if (!result || !Telegram.WebApp.initDataUnsafe.user?.phone) {
                Telegram.WebApp.showAlert('Phone sharing failed');
                throw new Error('Phone sharing failed');
            }
            
            return await this.login();
        } catch (error) {
            Telegram.WebApp.showAlert(`Phone request failed: ${error.message}`);
            throw error;
        }
    },

    truncateString(str, maxLength) {
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }
};