import axios from 'axios';

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
            // Telegram.WebApp.showAlert(`Отправляем данные:\n${JSON.stringify(userData, null, 2)}`);
            // console.log('Telegram initData:', window.Telegram.WebApp.initData);
            // console.log('User data for server:', userData);

            // Добавляем логирование URL перед запросом
            // const fullUrl = window.axios.defaults.baseURL + '/telegram/login';
            // Telegram.WebApp.showAlert(`Отправляем запрос на:\n${fullUrl}`);
            // console.log('Request URL:', fullUrl);

            // const response = await axios.post('/telegram/login', userData);
            
            // Добавляем точные заголовки из curl
            // Добавьте перед запросом
            console.log('Full request URL:', window.axios.defaults.baseURL + '/telegram/login');
            Telegram.WebApp.showAlert('Full request URL:', window.axios.defaults.baseURL + '/telegram/login');
            
            const response = await axios.post('/telegram/login', userData, {
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
                return response.data.data;
            } else if (response.data.data.error === "phone_required") {
                this.$router.push({ name: 'confirm-phone' });
            } else {
                throw new Error('Invalid response from server');
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
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
