import axios from 'axios';

export const telegramAuth = {
    async login() {
        // try {
        //     // Mock user data for testing
        //     const mockUser = {
        //         id: 12345670,
        //         username: 'test_user',
        //         first_name: 'Test Client User',
        //         phone: '+77777777777',
        //         auth_date: Math.floor(Date.now() / 1000),
        //         hash: 'mock_hash_value'
        //     };

            

        //     const response = await axios.post('/telegram/login', mockUser);

        if (!window.Telegram?.WebApp?.initData) {
            throw new Error('Telegram WebApp data not available');
        }

        const initData = window.Telegram.WebApp.initData;
        // Show initData in Telegram alert before any processing
        window.Telegram.WebApp.showAlert(`InitData: ${initData}`);

        try {
            const response = await axios.post('/telegram/login', initData);

            console.log('Auth response:', response);
            
            if (response.data.data && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                this.$router.push({ name: 'confirm-phone' });
            } else {
                throw new Error('Invalid response from server');
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
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
};