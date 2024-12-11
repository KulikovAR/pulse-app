<template>
    <div class="reminder-item__wrapper">
        <div class="container">
            <div class="reminder-item">
                <div class="reminder-item__header">
                    <router-link :to="{ name:'main' }">
                        <img class="reminder-item__back-arrow" src="/images/reminder/back-arrow.svg" alt="">
                    </router-link>
                    <div class="reminder-item__service-content">
                        Стрижка волос, уход за бородой
                    </div>
                </div>

                <div class="reminder-item__service-info">
                    <div class="reminder-item__service-info-item time">
                        <span class="service-info-title-span">
                            Время: 
                        </span>
                        <span class="service-info-content-span">
                            11:00 
                        </span>
                    </div>
                    <div class="reminder-item__service-info-item address">
                        <span class="service-info-title-span">
                            Адрес: 
                        </span>
                        <span class="service-info-content-span">
                            Ул. Красноармейская 112, к3
                        </span>
                    </div>
                    <div class="reminder-item__service-info-item master">
                        <span class="service-info-title-span">
                            Мастер: 
                        </span>
                        <span class="service-info-content-span"> 
                            Никита
                        </span>
                    </div>
                </div>

                <a class="set-route" href="#">Проложить маршрут</a>

                <div class="reminder-item__settings">
                    <div class="reminder-item__settings-item moment">
                        <img class="reminder-item__settings-img" src="/images/reminder/moment.svg" alt="">
                        <div class="reminder-item__settings-info">
                            за: 1 час
                        </div>
                    </div>
                    <div class="reminder-item__settings-item interval">
                        <img class="reminder-item__settings-img" src="/images/reminder/interval.svg" alt="">
                        <div class="reminder-item__settings-info">
                            Каждые 2 недели
                        </div>
                    </div>
                </div>

            </div>

            <div class="reminder-btns">
                <div class="reminder-btn cancel" @click="showCancelPopUp">
                    Отменить
                </div>
                <router-link :to="{name: 'calendar-page'}" class="reminder-btn reschedule">
                    Перенести
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ReminderSinglePageItem',
    methods: {
        showCancelPopUp(){
            this.$emit('showCancelPopUp');
        },
        cancel(){
            //отменяем запись
            
            //для примера
            alert('Запись отменена');

            
        }
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
        flex-grow: 1; /* Растягиваем reminder-item внутри wrapper */
        padding: 22px 16px;
        display: flex;
        flex-direction: column;
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

    .reminder-btns{
        width: 100%;
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .reminder-btn{
        width: 50%;
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

        cursor: pointer;
    }
    .reminder-btn.cancel{
        color: rgba(255, 59, 48, 1);
    }
</style>