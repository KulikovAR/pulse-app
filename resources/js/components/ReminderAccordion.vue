<template>
    <div class="reminder-accordion">
        <div class="container">
            <div class="reminder-accordion__list">

                <div class="reminder-accordion__item today active">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        СЕГОДНЯ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersToday" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'cancelled': item.status === 'cancelled', 'unread': item.status === 'unread', 'confirmed': item.status === 'confirmed' }]" >
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img" :style="{ backgroundColor: !item.company.image ? getAvatarColor(item.company.name) : 'transparent' }">
                                    <template v-if="item.company.image">
                                        <img class="reminder-item__header__service-img-img" :src="item.company.image" alt="" />
                                    </template>
                                    <template v-else>
                                        <span class="avatar-letter">{{ item.company.name.charAt(0).toUpperCase() }}</span>
                                    </template>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.company.name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{formatServiceNames(item.services)}}
                            </div>
                            <div class="reminder-item__service-date-time">
                                <div class="reminder-item__service-time">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/time.svg">
                                    <span class="service-time">{{this.getServiceTime(item.event_time)}}</span>
                                </div>
                                <div class="reminder-item__service-date">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/date.svg">
                                    <span class="service-time">{{this.getServiceDate(item.event_time)}}</span>
                                </div>
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item tomorrow">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ЗАВТРА
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersTomorrow" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'cancelled': item.status === 'cancelled', 'unread': item.status === 'unread', 'confirmed': item.status === 'confirmed' }]">
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img" :style="{ backgroundColor: !item.company.image ? getAvatarColor(item.company.name) : 'transparent' }">
                                    <template v-if="item.company.image">
                                        <img class="reminder-item__header__service-img-img" :src="item.company.image" alt="" />
                                    </template>
                                    <template v-else>
                                        <span class="avatar-letter">{{ item.company.name.charAt(0).toUpperCase() }}</span>
                                    </template>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.company.name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{formatServiceNames(item.services)}}
                            </div>
                            <div class="reminder-item__service-date-time">
                                <div class="reminder-item__service-time">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/time.svg">
                                    <span class="service-time">{{this.getServiceTime(item.event_time)}}</span>
                                </div>
                                <div class="reminder-item__service-date">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/date.svg">
                                    <span class="service-time">{{this.getServiceDate(item.event_time)}}</span>
                                </div>
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item later">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ПОТОМ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersLater" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'cancelled': item.status === 'cancelled', 'unread': item.status === 'unread', 'confirmed': item.status === 'confirmed' }]">
                            <div class="reminder-item__header">
                                <div class="reminder-item__header__service-img" :style="{ backgroundColor: !item.company.image ? getAvatarColor(item.company.name) : 'transparent' }">
                                    <template v-if="item.company.image">
                                        <img class="reminder-item__header__service-img-img" :src="item.company.image" alt="" />
                                    </template>
                                    <template v-else>
                                        <span class="avatar-letter">{{ item.company.name.charAt(0).toUpperCase() }}</span>
                                    </template>
                                </div>
                                <div class="reminder-item__header__service-name">
                                    {{item.company.name}}
                                </div>
                            </div>
                            <div class="reminder-item__service-content">
                                {{formatServiceNames(item.services)}}
                            </div>
                            <div class="reminder-item__service-date-time">
                                <div class="reminder-item__service-time">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/time.svg">
                                    <span class="service-time">{{this.getServiceTime(item.event_time)}}</span>
                                </div>
                                <div class="reminder-item__service-date">
                                    <img class="reminder-item__service-time__img" src="/images/reminder/date.svg">
                                    <span class="service-time">{{this.getServiceDate(item.event_time)}}</span>
                                </div>
                            </div>
                        </router-link>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ReminderAccordion',
    data(){
        return{
            reminders: [],
            remindersToday: [],
            remindersTomorrow: [],
            remindersLater: [],
        }
    },
    methods: {
        async fetchReminders() {
            try {
                const response = await window.axios.get('/events');
                console.log(response);
                this.reminders = response.data.data;
                this.remindersDistribution();
            } catch (error) {
                console.error('Error fetching reminders:', error);
            }
        },
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
        formatServiceNames(services) {
            if (!services || !services.length) return '';
            const serviceNames = services.map(service => service.name);
            serviceNames[0] = serviceNames[0].charAt(0).toUpperCase() + serviceNames[0].slice(1);
            return serviceNames.join(', ');
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
        remindersDistribution(){
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            const startOfDayAfterTomorrow = new Date(startOfTomorrow);
            startOfDayAfterTomorrow.setDate(startOfDayAfterTomorrow.getDate() + 1);

            // Clear previous data
            this.remindersToday = [];
            this.remindersTomorrow = [];
            this.remindersLater = [];

            const processEvent = (event) => {
                const originalDate = new Date(event.event_time);
                const eventDate = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);

                if (eventDate >= startOfToday && eventDate < startOfTomorrow) {
                    this.remindersToday.push(event);
                } else if (eventDate >= startOfTomorrow && eventDate < startOfDayAfterTomorrow) {
                    this.remindersTomorrow.push(event);
                } else if (eventDate >= startOfDayAfterTomorrow) {
                    this.remindersLater.push(event);
                }
            };

            this.reminders.forEach(originalEvent => {
                // Process main event
                processEvent(originalEvent);
                
                // Process all repeats
                if(originalEvent.repeats && originalEvent.repeats.length) {
                    originalEvent.repeats.forEach(repeat => {
                        const repeatEvent = {
                            ...originalEvent,
                            event_time: repeat.event_time,
                        };
                        processEvent(repeatEvent);
                    });
                }
            });
        },
        getServiceTime(date_time){

            const originalDate = new Date(date_time);

            const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);

            // Извлекаем часы и минуты, добавляя ведущий ноль при необходимости
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            const time = `${hours}:${minutes}`;
            // console.log(time);
            return time;
        },
        getServiceDate(date_time){

            const originalDate = new Date(date_time);

            const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);

            // Format day and month with leading zeros
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            
            // Get short weekday name in Russian
            const weekdays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            const weekday = weekdays[date.getDay()];
            
            return `${day}.${month}. ${weekday}`;
        }
    },
    mounted(){
        this.fetchReminders();
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
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .reminder-accordion__item{
        width: 100%;
    }

    .reminder-accordion__item__title{
        width: 100%;
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
        position: relative;
        padding: 12px;
        display: flex;
        flex-direction: column;

        cursor: pointer;
        margin-bottom: 8px;
        background: #ffffff;
        border-radius: 12px;

        color: var(--theme-text-color-black);
    }

    .reminder-item.cancelled::after{
        content: 'Отменено';
        width: 70px;
        height: 23px;

        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 100%;
        letter-spacing: 0px;


        position: absolute;
        bottom: 12px;
        right: 12px;

        display: flex;
        justify-content: center;
        align-items: center;

        /* border: 1px solid var(--theme-destructive-color); */
        border-radius: 6px;
        background: #E5393526;
        color: #E53935;
    }

    .reminder-item.unread::after{
        content: 'Не подтверждено';
        width: 116px;
        height: 23px;

        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 100%;
        letter-spacing: 0px;


        position: absolute;
        bottom: 12px;
        right: 12px;

        display: flex;
        justify-content: center;
        align-items: center;

        /* border: 1px solid var(--theme-destructive-color); */
        border-radius: 6px;
        background: #EDEDEE;
        color: #707579;
    }

    .reminder-item.confirmed::after{
        content: 'Подтверждено';
        width: 99px;
        height: 23px;

        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 100%;
        letter-spacing: 0px;


        position: absolute;
        bottom: 12px;
        right: 12px;

        display: flex;
        justify-content: center;
        align-items: center;

        /* border: 1px solid var(--theme-destructive-color); */
        border-radius: 6px;
        background: #3390EC26;
        color: #3390EC;
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

    .reminder-item__service-date-time{
        display: flex;
        align-items: center;
    }

    .reminder-item__service-time{
        font-family: Microsoft Sans Serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 14.71px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        display: flex;
        align-items: center;
    }

    .reminder-item__service-time__img{
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }

    .reminder-item__service-date{
        display: flex;
        align-items: center;
        margin-left: 12px;
    }

    span.service-time{
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #000000;
        display: flex;
        height: 16px;
        align-items: center;
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

    .avatar-letter {
        color: white;
        font-size: 15px;
        font-weight: 500;
    }
</style>