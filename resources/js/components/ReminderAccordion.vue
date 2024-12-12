<template>
    <div class="reminder-accordion">
        <div class="container">
            <div class="reminder-accordion__list">

                <div class="reminder-accordion__item today active">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        СЕГОДНЯ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link :to="{ name:'reminder-page' }" v-for="(item,index) in this.remindersToday" :key="index" class="reminder-item">
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img">
                                    <img class="reminder-item__header__service-img-img" :src="item.service_img" :alt=item.service_name>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.service_name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{item.service_service}}
                            </div>
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.date_time)}}
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item tomorrow">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ЗАВТРА
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link :to="{ name:'reminder-page' }" v-for="(item,index) in this.remindersTomorrow" :key="index" class="reminder-item">
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img">
                                    <img class="reminder-item__header__service-img-img" :src="item.service_img" :alt=item.service_name>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.service_name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{item.service_service}}
                            </div>
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.date_time)}}
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item later">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ПОТОМ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link :to="{ name:'reminder-page' }" v-for="(item,index) in this.remindersLater" :key="index" class="reminder-item">
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img">
                                    <img class="reminder-item__header__service-img-img" :src="item.service_img" :alt=item.service_name>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.service_name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{item.service_service}}
                            </div>
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.date_time)}}
                            </div>
                        </router-link>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReminderAccordion',
    data(){
        return{
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
            remindersToday: [],
            remindersTomorrow: [],
            remindersLater: [],
        }
    },
    methods: {
        toggleAccord(event){
            let node = event.target;
            while(!node.classList.contains('reminder-accordion__item__title')){
                node = node.parentNode;
                if(node.classList.contains('reminder-accordion__item')){
                    return;
                }
            }
            node = node.parentNode;
            let accords = document.querySelectorAll('.reminder-accordion__item');
            accords.forEach((accord)=>{
                accord.classList.remove('active')
            });
            node.classList.add('active');
        },
        remindersDistribution(){
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            
            const startOfDayAfterTomorrow = new Date(startOfTomorrow);
            startOfDayAfterTomorrow.setDate(startOfDayAfterTomorrow.getDate() + 1);
            

            // console.log('startOfToday: ',startOfToday);
            // console.log('startOfTomorrow: ',startOfTomorrow);
            // console.log('startOfDayAfterTomorrow: ',startOfDayAfterTomorrow);

            this.reminders.forEach((reminder)=>{
                const reminderDate = new Date(reminder.date_time);

                // console.log('now: ',now,' --- ', reminderDate);
                // console.log(reminderDate.getHours());

                if (reminderDate >= startOfToday && reminderDate < startOfTomorrow) {
                    this.remindersToday.push(reminder);
                } else if (reminderDate >= startOfTomorrow && reminderDate < startOfDayAfterTomorrow) {
                    this.remindersTomorrow.push(reminder);
                } else if (reminderDate >= startOfDayAfterTomorrow) {
                    this.remindersLater.push(reminder);
                }
            });
        },
        getServiceTime(date_time){

            const date = new Date(date_time);

            // Извлекаем часы и минуты, добавляя ведущий ноль при необходимости
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            const time = `${hours}:${minutes}`;
            // console.log(time);
            return time;
        }
    },
    mounted(){
        this.remindersDistribution();
    }
}
</script>

<style scoped>
    .reminder-accordion{
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
    }
    .reminder-accordion .container{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }



    .reminder-accordion__list{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .reminder-accordion__item__title{
        position: relative;
        font-family: Microsoft Sans Serif;
        font-size: 24px;
        font-weight: 400;
        line-height: 27.16px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        padding: 10px 0;
        cursor: pointer;
    }

    .reminder-accordion__item__reminder-list{
        padding: 8px 0;
        display: none;
        flex-direction: column;
    }


    .reminder-item{
        padding: 12px;
        display: flex;
        flex-direction: column;

        cursor: pointer;
        margin-bottom: 8px;
        background: #ffffff;
        border-radius: 12px;

        color: var(--theme-text-color-black);
    }

    .reminder-item__header{
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }

    .reminder-item__header__service-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 7px;
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background-color: #f0f0f0; /* Цвет фона для случаев, если изображение не загрузится */
    }

    .reminder-item__header__service-img-img {
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
    }

    .reminder-item__header__service-name{
        display: flex;
        justify-content: start;
        align-items: center;
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
    }

    .reminder-item__service-content{
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        margin-bottom: 12px;
    }

    .reminder-item__service-time{
        font-family: Microsoft Sans Serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 14.71px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

    }

    span.service-time{
        color: var(--theme-text-color-gray);
    }

    .reminder-accordion__item.later .reminder-accordion__item__title {
        color: var(--theme-text-color-gray);
    }
</style>

<style scoped>
    .reminder-accordion__item.active .reminder-accordion__item__reminder-list{
        display: flex;
    }
</style>

<style scoped>
    .reminder-accordion__item .reminder-accordion__item__title::after{
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
    }
    .reminder-accordion__item.today .reminder-accordion__item__title::after{
        background: var(--theme-indicator-color-today);
    }
    .reminder-accordion__item.tomorrow .reminder-accordion__item__title::after{
        background: var(--theme-indicator-color-tomorrow);
    }
    .reminder-accordion__item.later .reminder-accordion__item__title::after{
        background: var(--theme-indicator-color-later);
    }
</style>