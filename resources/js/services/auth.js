import axios from 'axios';

export const telegramAuth = {
    async login() {
        try {
            // Show initial alert and wait for it to complete
            await Telegram.WebApp.showAlert('Starting login process...');
            
            // Check Telegram WebApp availability
            if (!window.Telegram?.WebApp?.initData) {
                await Telegram.WebApp.showAlert('Error: Telegram WebApp data not available');
                throw new Error('Telegram WebApp data not available');
            }

            await Telegram.WebApp.showAlert('Checking authentication data...');

            const response = await axios.post('/telegram/login', {
                initData: window.Telegram.WebApp.initData
            });

            console.log('Auth response:', response);
            await Telegram.WebApp.showAlert(`Login response received: ${response.data.data ? 'Success' : 'Failed'}`);
            
            if (response.data.data && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                await Telegram.WebApp.showAlert('Authentication successful! Token received.');
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                await Telegram.WebApp.showAlert('Phone verification required');
                this.$router.push({ name: 'confirm-phone' });
            } else {
                await Telegram.WebApp.showAlert('Error: Invalid response from server');
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            await Telegram.WebApp.showAlert(`Login error: ${error.message}`);
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
            Telegram.WebApp.showAlert('Requesting phone number...');
            const result = await new Promise((resolve) => {
                Telegram.WebApp.requestContact(resolve);
            });
            
            Telegram.WebApp.showAlert('Phone request result: ' + (result ? 'Granted' : 'Denied'));
            
            if (!result || !Telegram.WebApp.initDataUnsafe.user?.phone) {
                Telegram.WebApp.showAlert('Phone sharing failed');
                throw new Error('Phone sharing failed');
            }
            
            Telegram.WebApp.showAlert('Phone number received, proceeding with login...');
            
            return await this.login();
        } catch (error) {
            Telegram.WebApp.showAlert(`Phone request failed: ${error.message}`);
            throw error;
        }
    },
};