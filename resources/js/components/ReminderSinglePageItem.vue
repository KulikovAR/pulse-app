<template>
    <div class="reminder-item__wrapper">
        <div class="container">
            <div :class="['reminder-item', { 'cancelled': event?.status === 'cancelled' }]">
                <div class="reminder-item__header">
                    <router-link :to="{ name:'main' }">
                        <img class="reminder-item__back-arrow" src="/images/reminder/back-arrow.svg" alt="">
                    </router-link>
                    <div class="reminder-item__service-content">
                        {{ event ? formatServiceNames(event.services) : 'Loading...' }}
                    </div>
                </div>

                <div class="reminder-item__service-info">
                    <div class="reminder-item__service-info-item time">
                        <span class="service-info-title-span">
                            Время: 
                        </span>
                        <span class="service-info-content-span">
                            {{ event ? getServiceTime(event.event_time) : 'Loading...' }}
                        </span>
                    </div>
                    <div class="reminder-item__service-info-item time">
                        <span class="service-info-title-span">
                            Когда: 
                        </span>
                        <span class="service-info-content-span">
                            {{ event ? getServiceDate(event.event_time) : 'Loading...' }}
                        </span>
                    </div>
                    <div class="reminder-item__service-info-item address">
                        <span class="service-info-title-span">
                            Адрес: 
                        </span>
                        <span class="service-info-content-span">
                            {{ event ? event.company.address : 'Loading...' }}
                        </span>
                    </div>
                    <!-- <div class="reminder-item__service-info-item master">
                        <span class="service-info-title-span">
                            Мастер: 
                        </span>
                        <span class="service-info-content-span"> 
                            Никита
                        </span>
                    </div> -->
                </div>

                <!-- <a class="set-route" href="#">Проложить маршрут</a> -->

                <div class="reminder-item__settings">
                    <div class="reminder-item__settings-item moment">
                        <img class="reminder-item__settings-img" src="/images/reminder/moment.svg" alt="">
                        <div class="reminder-item__settings-info">
                            за: 1 час
                        </div>
                    </div>
                    <div v-if="event?.repeat_type || event?.target_time" class="reminder-item__settings-item interval">
                        <img class="reminder-item__settings-img" src="/images/reminder/interval.svg" alt="">
                        <div class="reminder-item__settings-info">
                            {{this.getRepeatText(event)}}
                        </div>
                    </div>
                </div>

                <div v-if="event?.status" :class="['reminder-item__service-info-item status', { 'cancelled': event.status === 'cancelled', 'unread': event.status === 'unread', 'confirmed': event.status === 'confirmed' }]"> 
                    {{this.getEventStatus(event?.status)}}
                </div>
            </div>

            <div v-if="!(event?.status === 'cancelled')" class="reminder-btns__wrapper">
                <div class="reminder-btns">
                    <div class="reminder-btn cancel" @click="showCancelPopUp">
                        Отменить
                    </div>
                    <div v-if="!(event?.status === 'confirmed')" class="reminder-btn confirm" @click="showConfirmPopUp">
                        Подтвердить
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import notification from '../services/notification'
import axios from 'axios';
export default {
    name: 'ReminderSinglePageItem',
    data() {
        return {
            event: null,
            error: null
        }
    },
    methods: {
        formatServiceNames(services) {
            if (!services || !services.length) return '';
            const serviceNames = services.map(service => service.name);
            serviceNames[0] = serviceNames[0].charAt(0).toUpperCase() + serviceNames[0].slice(1);
            return serviceNames.join(', ');
        },
        getServiceTime(date_time){
            if (!date_time) return 'N/A';
            const originalDate = new Date(date_time);
            const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        },
        getServiceDate(date_time){
            if (!date_time) return 'N/A';
            const originalDate = new Date(date_time);
            const date = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000);
            // Format day and month with leading zeros
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            // Get short weekday name in Russian
            const weekdays = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            const weekday = weekdays[date.getDay()];
            return `${day}.${month}. ${weekday}`;
        },
        getEventStatus(status) {
            switch (status) {
                case 'confirmed':
                    return 'Подтверждено';
                case 'unread':
                    return 'Не подтверждено';
                case 'cancelled':
                    return 'Отменено';
                default:
                    return 'Неизвестный статус';
            }
        },
        getRepeatText(event) {
            if (!event) return 'N/A';
            
            if (event.repeat_type) {
                const types = {
                    weekly: 'Каждую неделю',
                    biweekly: 'Каждые 2 недели',
                    monthly: 'Каждый месяц'
                };
                return types[event.repeat_type] || 'Без повтора';
            }
            
            if (event.target_time) {
                return this.getServiceDate(event.target_time);
            }
            
            return 'Без повтора';
        },
        showCancelPopUp(){
            this.$emit('showCancelPopUp');
        },
        showConfirmPopUp(){
            this.$emit('showConfirmPopUp');
        },
        async cancel(){
            try {
                if (!this.event) {
                    throw new Error('No event data available');
                }
                await window.axios.put(`/event/${this.event.id}/cancel`);
                notification.show({
                    text: 'Запись отменена',
                    type: 'error'
                });
                this.$router.push({ name: 'main' });
            } catch (error) {
                notification.show({
                    text: 'Не удалось отменить запись',
                    type: 'info'
                });
                console.error('Error canceling event:', error);
                Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
            }
        },
        async confirm(){
            try {
                if (!this.event) {
                    throw new Error('No event data available');
                }
                await window.axios.put(`/event/${this.event.id}/confirm`);
                notification.show({
                    text: 'Запись подтверждена',
                    type: 'success'
                });
                this.$router.push({ name: 'main' });
            } catch (error) {
                notification.show({
                    text: 'Не удалось подтвердить запись',
                    type: 'info'
                });
                console.error('Error canceling event:', error);
                Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
            }
        },
        async fetchEventData() {
            try {
                if (!this.$route.params.id) {
                    throw new Error('Event ID is missing');
                }
                const response = await window.axios.get(`/event/${this.$route.params.id}`);
                
                // Update event_time if repeats exist
                const event = response.data.data;
                if(event.repeats?.length > 0) {
                    event.event_time = event.repeats[0].event_time;
                }
                
                this.event = event;
            } catch (error) {
                console.error('Error fetching event data:', error);
                this.error = error.message;
                this.$router.push({ name: 'main' });
            }
        },
    },
    mounted() {
        this.fetchEventData();
    }
}
</script>

<style scoped>
    .reminder-item__wrapper{
        padding: 12px 0;
        flex-grow: 1; /* Занимаем оставшееся пространство после Header и Services */
        display: flex;
        flex-direction: column;
    }
    .reminder-item__wrapper .container{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .reminder-item{
        position: relative;
        border-radius: 12px;
        flex-grow: 1; /* Растягиваем reminder-item внутри wrapper */
        display: flex;
        flex-direction: column;

        background: #fff;
        padding: 22px 16px;
        margin-bottom: 64px;
    }

    .reminder-item.cancelled{
        margin-bottom: 8px;
    }

    /* .reminder-item.canceled::after{
        content: 'Canceled';
        width: 50px;
        height: 20px;
        font-family: Microsoft Sans Serif;
        font-size: 10px;
        font-weight: 400;
        line-height: 10px;
        position: absolute;
        top: 0;
        right: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid var(--theme-destructive-color);
        border-radius: 12px;
        background: var(--theme-destructive-color);
        color: #fff;
    } */

    .reminder-item__service-info-item.status{
        margin-top: 24px;
        width: 80px;
        height: 23px;

        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 100%;
        letter-spacing: 0px;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 6px;
        background: #E5393526;
        color: #E53935;
    }

    .reminder-item__service-info-item.status.unread{
        width: 116px;
        background: #EDEDEE;
        color: #707579;
    }

    .reminder-item__service-info-item.status.confirmed{
        width: 99px;
        background: #3390EC26;
        color: #3390EC;
    }

    .reminder-item__header{
        display: flex;
        justify-content: start;
        align-items: start;
        margin-bottom: 34px;
    }
    .reminder-item__back-arrow{
        width: 6px;
        height: 30px;
        cursor: pointer;
        margin-right: 12px;
    }
    .reminder-item__service-content{
        font-family: Microsoft Sans Serif;
        font-size: 24px;
        font-weight: 400;
        line-height: 27.16px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

    }

    .reminder-item__service-info{
        display: flex;
        flex-direction: column;
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        margin-bottom: 24px;
    }
    .reminder-item__service-info-item+.reminder-item__service-info-item{
        margin-top: 12px;
    }
    span.service-info-title-span{
        color: var(--theme-text-color-gray);
    }
    .set-route{
        padding: 10px 24px;
        text-decoration: none;
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: rgba(0, 122, 255, 1);

        width: fit-content;
        background: var(--theme-bg-color-white);
        border-radius: 12px;

        margin-bottom: 24px;
    }
    
    .reminder-item__settings{
        display: flex;
        flex-direction: column;
    }
    .reminder-item__settings-item{
        display: flex;
        align-items: center;
    }
    .reminder-item__settings-item+.reminder-item__settings-item{
        margin-top: 18px;
    }

    .reminder-item__settings-img{
        width: 20px;
        height: 20px;
        margin-right: 6px;
    }

    .reminder-item__settings-info{
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: var(--theme-text-color-gray);

    }

    .reminder-btns__wrapper{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;

        background: #EFEFF3;
        padding: 12px 0 20px;
        display: flex;
        justify-content: center;
    }

    .reminder-btns{
        width: 100%;
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;

        /* margin-bottom: 20px; */
        /* max-width: 400px; */
        padding: 0 16px;
    }

    .reminder-btn{
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-align: center;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: var(--theme-text-color-black);
        background: #FFFFFF;
        border-radius: 12px;

        cursor: pointer;
    }
    .reminder-btn.cancel{
        color: rgba(255, 59, 48, 1);
    }
    .reminder-btn.confirm{
        color: #F4F4F5;
        background: #3390EC;
    }
</style>