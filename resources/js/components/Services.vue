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
                        <div class="services-list__item__img">
                            <img
                                class="services-list__item__img-img"
                                :src="item.img"
                                :alt="item.name"
                                @error="setFallbackImage(index)"
                            />
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
export default {
    name: 'Services',
    data() {
        return {
            services: [
                {   
                    id: 1,
                    img: "/images/services/item-1.svg",
                    name: "Барбер-шоп"
                },
                {
                    id: 2,
                    img: "/images/services/item-2.jpg",
                    name: "Автосервис"
                },
                {
                    id: 3,
                    img: "/images/services/item-3.svg",
                    name: "Салон красоты"
                },
                {
                    id: 4,
                    img: "/images/services/item-1.svg",
                    name: "Тренажерный зал"
                },
                {
                    id: 5,
                    img: "/images/services/item-1.svg",
                    name: "Барбер-шоп2"
                },
                {
                    id: 6,
                    img: "/images/services/item-1.svg",
                    name: "Барбер-шоп3"
                },
            ],
            reminders: [
                {
                    id: 1,
                    client_id: 1,
                    service_id: 1,
                    service_name: "Барбер-шоп",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Стрижка волос, уход за бородой",
                    date_time: "2024-12-12T18:00:00.000Z"
                },
                {
                    id: 2,
                    client_id: 1,
                    service_id: 2,
                    service_name: "Автосервис",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Замена масла",
                    date_time: "2024-12-12T19:15:00.000Z"
                },
                {
                    id: 3,
                    client_id: 1,
                    service_id: 3,
                    service_name: "Салон красоты",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Укладка",
                    date_time: "2024-12-12T20:30:00.000Z"
                },
                {
                    id: 4,
                    client_id: 1,
                    service_id: 4,
                    service_name: "Тренажерный зал",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Занятие",
                    date_time: "2024-12-13T07:45:00.000Z"
                },
                {
                    id: 5,
                    client_id: 1,
                    service_id: 1,
                    service_name: "Барбер-шоп",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Завивка усов",
                    date_time: "2024-12-13T11:40:00.000Z"
                },
                {
                    id: 6,
                    client_id: 1,
                    service_id: 2,
                    service_name: "Автосервис",
                    service_img: "/images/services/item-1.svg",
                    service_service: "Установка правой фары",
                    date_time: "2024-12-14T13:05:00.000Z"
                },
            ],
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

        this.remindersIndicatorDistribution();
    },
    methods: {
        setFallbackImage(index) {
            this.services[index].img = this.fallbackImage;
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
                const reminderDate = new Date(reminder.date_time);
                let day = null;

                if (reminderDate >= startOfToday && reminderDate < startOfTomorrow) {
                    day = 'today';
                } else if (reminderDate >= startOfTomorrow && reminderDate < startOfDayAfterTomorrow) {
                    day = 'tomorrow';
                } else if (reminderDate >= startOfDayAfterTomorrow) {
                    day = 'later';
                }

                if (day) {
                    const service = this.services.find(service => service.id === reminder.service_id);
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
}

/* Обертка для маскирования краев */
.services-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden; /* Маскируем края */
}

/* Список сервисов */
.services-list {
    display: flex;
    padding: 14px 0;
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
    width: 75px;
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
}

.services-list__item.tomorrow::after {
    background: var(--theme-indicator-color-tomorrow);
}

.services-list__item.later::after {
    background: var(--theme-indicator-color-later);
}
</style>
