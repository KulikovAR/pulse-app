<template>
    <div class="services">
        <div class="container">
            <!-- Оболочка для маскирования краев -->
            <div class="services-wrapper">
                <div class="services-list">
                    <div
                        v-for="(item, index) in this.services"
                        :key="index"
                        class="services-list__item"
                        :class="(item.day == 'today') ? 'today' : (item.day == 'tomorrow') ? 'tomorrow' : (item.day == 'later') ? 'later' : ''"
                    >
                        

                        <div class="services-list__item__img" :style="{ backgroundColor: !item.image ? getAvatarColor(item.name) : 'transparent' }">
                            <template v-if="item.image">
                                <img class="services-list__item__img-img" :src="item.image" alt="" />
                            </template>
                            <template v-else>
                                <span class="avatar-letter">{{ item.name.charAt(0).toUpperCase() }}</span>
                            </template>
                        </div>

                        <div class="services-list__item__name">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Services',
    data() {
        return {
            services: [],
            reminders: [],
            fallbackImage: "/images/logo.svg",
        };
    },
    mounted() {
        const container = this.$el.querySelector('.services-list');

        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // Отключаем стандартное поведение
            container.scrollBy({
                left: event.deltaY, // Используем вертикальный скролл для горизонтального
                behavior: 'smooth',
            });
        });

        this.fetchServices();
        this.fetchReminders();
    },
    methods: {
        async fetchServices() {
            try {
                const response = await window.axios.get('/companies/client');
                this.services = response.data.data;
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        },
        setFallbackImage(index) {
            this.services[index].img = this.fallbackImage;
        },
        getAvatarColor(name) {
            const colors = [
                '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
                '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
                '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
                '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
            ];
            const charCode = name.charCodeAt(0);
            return colors[charCode % colors.length];
        },

        async fetchReminders() {
            try {
                const response = await window.axios.get('/events');
                this.reminders = response.data.data;
                this.remindersIndicatorDistribution();
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        },
        remindersIndicatorDistribution() {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            const startOfDayAfterTomorrow = new Date(startOfTomorrow);
            startOfDayAfterTomorrow.setDate(startOfDayAfterTomorrow.getDate() + 1);

            // Сбросим поле day у всех сервисов
            this.services.forEach(service => {
                service.day = null;
            });

            // Обходим напоминания и обновляем соответствующие сервисы
            this.reminders.forEach(reminder => {
                const originalReminderDate = new Date(reminder.event_time);
                const reminderDate = new Date(originalReminderDate.getTime() - originalReminderDate.getTimezoneOffset() * 60000);
                let day = null;

                if (reminderDate >= startOfToday && reminderDate < startOfTomorrow) {
                    day = 'today';
                } else if (reminderDate >= startOfTomorrow && reminderDate < startOfDayAfterTomorrow) {
                    day = 'tomorrow';
                } else if (reminderDate >= startOfDayAfterTomorrow) {
                    day = 'later';
                }

                if (day) {
                    const service = this.services.find(service => service.id === reminder.company_id);
                    if (service) {
                        // Устанавливаем day с учетом приоритета
                        if (
                            (day === 'today') || 
                            (day === 'tomorrow' && service.day !== 'today') || 
                            (day === 'later' && service.day !== 'today' && service.day !== 'tomorrow')
                        ) {
                            service.day = day;
                        }
                    }
                }
            });
        },
    },
};
</script>

<style scoped>
/* Основной контейнер */
.services {
    padding: 14px 0;
}

.services .container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
    max-width: unset;
    padding-left: unset !important;
    padding-right: unset !important;
}

/* Обертка для маскирования краев */
.services-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden; /* Маскируем края */
    max-width: 768px;
}

/* Список сервисов */
.services-list {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -ms-overflow-style: none; /* IE и Edge */
    scrollbar-width: none; /* Firefox */
    padding: 0 16px;
}

.services-list::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

/* Элемент слайдера */
.services-list__item {
    position: relative;
    width: 69px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 12px;
}
.services-list__item:last-child {
    margin-right: 0;
}

.services-list__item__img {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 8px;
    display: flex; 
    align-items: center; 
    justify-content: center; 
    background-color: #f0f0f0; /* Цвет фона для случаев, если изображение не загрузится */
    border: 1px solid #DFDEE5;
}

.services-list__item__img-img {
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
}

.services-list__item__name {
    font-family: Microsoft Sans Serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 14.71px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
}

/* Индикаторы дат */
.services-list__item::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: 5px;
}

.services-list__item.today::after {
    background: var(--theme-indicator-color-today);
    border: 2px solid #EFEFF3;
}

.services-list__item.tomorrow::after {
    background: var(--theme-indicator-color-tomorrow);
    border: 2px solid #EFEFF3;
}

.services-list__item.later::after {
    background: var(--theme-indicator-color-later);
    border: 2px solid #EFEFF3;
}

.avatar-letter {
        color: white;
        font-size: 32px;
        font-weight: 500;
    }
</style>
