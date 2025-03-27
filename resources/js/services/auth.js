import axios from 'axios';
import router from '../router';  // Add this import

export const telegramAuth = {
    async login() {
        try {
            const rawInitData = window.Telegram.WebApp.initData; // Сохраняем сырые данные
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
            Telegram.WebApp.showAlert(`Отправляем данные:\n${JSON.stringify(userData, null, 2)}`);
            console.log('Telegram initData:', window.Telegram.WebApp.initData);
            console.log('User data for server:', userData);
            
            const response = await axios.post('https://pulse-back.pisateli-studio.ru/api/v1/telegram/login', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Telegram-InitData': rawInitData,
                    'Accept': 'application/json' // Explicit accept header
                }
            });

            console.log('Auth response:', response);
            Telegram.WebApp.showAlert(`Ответ:\n${response}`);
            
            if (response.data.data?.token) {
                localStorage.setItem('token', response.data.data.token);
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                Telegram.WebApp.showAlert(`Получили токен:\n${response.data.data.token}`);
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                router.push({ name: 'confirm-phone' }); 
            } else {
                throw new Error('Invalid response from server');
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {

            if(error.response?.data?.data?.error === "phone_required") {
                router.push({ name: 'confirm-phone' });
            }
            // Детальный лог ошибки
            const errorInfo = {
                status: error.response?.status,
                message: error.message,
                serverResponse: error.response?.data,
                request: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            };

            const alertMessage = `❗ Ошибка авторизации:
Статус: ${errorInfo.status || 'N/A'}
Сообщение: ${errorInfo.message}
Ответ сервера: ${JSON.stringify(errorInfo.serverResponse)?.slice(0, 50)}...`;



            Telegram.WebApp.showAlert(alertMessage);
            console.error('Auth Error:', errorInfo);
            
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
                const debugInfo = JSON.stringify({
                    requestResponse: info,
                    initDataUnsafe: Telegram.WebApp.initDataUnsafe
                }, null, 2);
                
                Telegram.WebApp.showAlert(`Данные контакта:\n${debugInfo.slice(0, 250)}...`);
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
