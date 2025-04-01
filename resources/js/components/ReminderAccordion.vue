<template>
    <div class="reminder-accordion">
        <div class="container">
            <div class="reminder-accordion__list">

                <div class="reminder-accordion__item today active">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        СЕГОДНЯ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersToday" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'canceled': item.is_cancelled }]" >
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
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.event_time)}}
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item tomorrow">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ЗАВТРА
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersTomorrow" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'canceled': item.is_cancelled }]">
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
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.event_time)}}
                            </div>
                        </router-link>

                    </div>
                </div>

                <div class="reminder-accordion__item later">
                    <div class="reminder-accordion__item__title" @click="toggleAccord($event)">
                        ПОТОМ
                    </div>
                    <div class="reminder-accordion__item__reminder-list">
                        <router-link v-for="(item,index) in this.remindersLater" :key="index" :to="{ name:'reminder-page', params: { id: item.id } }" :class="['reminder-item', { 'canceled': item.is_cancelled }]">
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
                            <div class="reminder-item__service-time">
                                <span class="service-time">Время: </span> {{this.getServiceTime(item.event_time)}}
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
            

            // console.log('startOfToday: ',startOfToday);
            // console.log('startOfTomorrow: ',startOfTomorrow);
            // console.log('startOfDayAfterTomorrow: ',startOfDayAfterTomorrow);

            this.reminders.forEach((reminder)=>{
                const originalReminderDate = new Date(reminder.event_time);
                const reminderDate = new Date(originalReminderDate.getTime() - originalReminderDate.getTimezoneOffset() * 60000);

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

            const originalDate = new Date(date_time);

            const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);

            // Извлекаем часы и минуты, добавляя ведущий ноль при необходимости
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            const time = `${hours}:${minutes}`;
            // console.log(time);
            return time;
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

    .reminder-item.canceled::after{
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

    .avatar-letter {
        color: white;
        font-size: 15px;
        font-weight: 500;
    }
</style>