import axios from 'axios';
import router from '../router';  // Add this import

export const telegramAuth = {
    async login() {
        try {
            const rawInitData = window.Telegram.WebApp.initData;
            const initData = new URLSearchParams(rawInitData);
            const tgUser = JSON.parse(initData.get('user'));
            
            const userData = {
                id: tgUser.id,
                username: tgUser.username,
                first_name: tgUser.first_name,
                auth_date: initData.get('auth_date'),
                hash: initData.get('hash'),
                phone: Telegram.WebApp.initDataUnsafe.user?.phone || null
            };

            // Логируем все данные перед отправкой
            // Telegram.WebApp.showAlert(`Отправляем данные:\n${JSON.stringify(userData, null, 2)}`);
            // console.log('Telegram initData:', window.Telegram.WebApp.initData);
            // console.log('User data for server:', userData);
            
            const response = await window.axios.post('/telegram/login', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Telegram-InitData': rawInitData,
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                // Telegram.WebApp.showAlert(`Получили токен:\n${response.data.data.token}`);
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                router.push({ name: 'confirm-phone' }); 
            } else {
                throw new Error('Invalid response from server');
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
            Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
            if(error.response?.data?.data?.error === "phone_required") {
                router.push({ name: 'confirm-phone' });
            }
            
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
            // Properly handle both callback parameters
            const [success, info] = await new Promise((resolve) => {
                Telegram.WebApp.requestContact((success, info) => resolve([success, info]));
            });
            
            if (!success) {
                Telegram.WebApp.showAlert(`Отмена: ${JSON.stringify(info, null, 2)}`);
                throw new Error('User denied phone sharing');
            }
            
            // Get phone from responseUnsafe.contact according to typings
            const phone = info?.responseUnsafe?.contact?.phone_number;
            if (!phone) {
                throw new Error('Phone number not found in contact response');
            }
            
            // Update user data with received phone
            Telegram.WebApp.initDataUnsafe.user.phone = phone;
            
            return await this.login();
        } catch (error) {
            Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
            throw error;
        }
    },
};
