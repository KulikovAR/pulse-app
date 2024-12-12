<template>
    <div class="calendar-content">
        <div class="container">
            <div class="calendar-wrapper">
                <!-- Блок выбора месяца и управления навигацией -->
                <div class="calendar-month">
                    <div class="calendar-month__select-wrapper">
                        <select
                            class="calendar-month__select"
                            v-model="currentMonthIndex"
                            @change="updateCalendar"
                        >
                            <option
                                v-for="(month, index) in selectableMonths"
                                :value="index"
                                :key="index"
                            >
                                {{ month.name }}
                            </option>
                        </select>
                        <img
                            class="calendar-month__arrow-select"
                            src="/images/btns/select-arrow.svg"
                            alt="arrow"
                        />
                    </div>
                    <div class="calendar-month__arrows">
                        <img
                            class="calendar-month__arrow left"
                            src="/images/btns/left-arrow.svg"
                            alt="prev"
                            @click="changeMonth(-1)"
                            :class="{ disabled: !canGoBack }"
                        />
                        <img
                            class="calendar-month__arrow right"
                            src="/images/btns/right-arrow.svg"
                            alt="next"
                            @click="changeMonth(1)"
                            :class="{ disabled: !canGoForward }"
                        />
                    </div>
                </div>

                <!-- Календарь дней -->
                <div class="calendar">
                    <div class="calendar__title-days">
                        <div class="calendar__title-day" v-for="day in weekDays" :key="day">
                            {{ day }}
                        </div>
                    </div>
                    <div class="calendar__days">
                        <div
                            v-for="(day, index) in days"
                            :key="index"
                            class="calendar__day"
                            :class="{
                                active: day.isActive,
                                placeholder: !day.date,
                                today: day.isToday,
                                empty: day.isEmpty,
                            }"
                            @click="selectDate(day)"
                        >
                            {{ day.date }}
                        </div>
                    </div>
                </div>

                <!-- Блок расписания -->
                <div v-if="hasAvailableSlots" class="selected-day">
                    <div class="selected-day__time-division day">
                        <div class="selected-day__time-division__title">
                            День
                        </div>
                        <div class="selected-day__time-list">
                            <div
                                class="selected-day__time-item"
                                v-for="time in dayTimes"
                                :key="time"
                                :class="{ active: selectedTime === time }"
                                @click="selectTime(time)"
                            >
                                {{ time }}
                            </div>
                        </div>
                    </div>
                    <div class="selected-day__time-division evening">
                        <div class="selected-day__time-division__title">
                            Вечер
                        </div>
                        <div class="selected-day__time-list">
                            <div
                                class="selected-day__time-item"
                                v-for="time in eveningTimes"
                                :key="time"
                                :class="{ active: selectedTime === time }"
                                @click="selectTime(time)"
                            >
                                {{ time }}
                            </div>
                        </div>
                    </div>


                    <div class="selected-day__reschedule-btn-wrapper">
                        <div class="selected-day__reschedule-btn" @click="reschedule">
                            Перенести 
                        </div>
                    </div>

                </div>

                <!-- Блок отсутствия расписания -->
                <div v-else class="selected-day-empty">
                    <div class="selected-day-empty__title">
                        В этот день нет <br /> свободного времени
                    </div>
                    <div class="selected-day-empty__content">
                        Ближайшая доступная дата {{ nearestAvailableDate }}
                    </div>
                    <div class="selected-day-empty__go-to-date-btn" @click="selectNearestDate">
                        Перейти к дате
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CalendarContent",
    data() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        return {
            currentYear,
            currentMonth,
            days: [],
            currentMonthIndex: 0,
            selectedDate: { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() },
            selectedTime: null,
            availableSlots: [],
            selectableMonths: this.generateMonthList(currentYear, currentMonth),
            weekDays: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
            nearestAvailableDate: "",
        };
    },
    computed: {
        canGoBack() {
            return this.currentMonthIndex > 0;
        },
        canGoForward() {
            return this.currentMonthIndex < this.selectableMonths.length - 1;
        },
        hasAvailableSlots() {
            return this.availableSlots.length > 0;
        },
        dayTimes() {
            return this.availableSlots.filter(slot => parseInt(slot.split(":")[0]) < 16);
        },
        eveningTimes() {
            return this.availableSlots.filter(slot => parseInt(slot.split(":")[0]) >= 16);
        },
    },
    methods: {
        generateMonthList(currentYear, currentMonth) {
            const months = [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ];
            const list = [];
            for (let i = currentMonth; i < 12; i++) {
                list.push({ name: `${months[i]} ${currentYear}`, year: currentYear, month: i });
            }
            for (let i = 0; i < currentMonth; i++) {
                list.push({ name: `${months[i]} ${currentYear + 1}`, year: currentYear + 1, month: i });
            }
            return list;
        },
        updateCalendar() {
            const selected = this.selectableMonths[this.currentMonthIndex];
            this.generateCalendar(selected.year, selected.month);
        },
        changeMonth(direction) {
            if ((direction === -1 && this.canGoBack) || (direction === 1 && this.canGoForward)) {
                this.currentMonthIndex += direction;
                this.updateCalendar();
            }
        },
        generateCalendar(year, month) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const days = [];
            const startDay = firstDay.getDay() || 7;
            const daysInMonth = lastDay.getDate();

            for (let i = 1; i < startDay; i++) {
                days.push({ date: null });
            }
            for (let i = 1; i <= daysInMonth; i++) {
                const isToday =
                    year === new Date().getFullYear() &&
                    month === new Date().getMonth() &&
                    i === new Date().getDate();
                const isActive =
                    year === this.selectedDate.year &&
                    month === this.selectedDate.month &&
                    i === this.selectedDate.day;
                const isEmpty = i % 2 !== 0; // Пустые даты для примера
                days.push({ date: i, isToday, isActive, isEmpty });
            }
            while (days.length % 7 !== 0) {
                days.push({ date: null });
            }
            this.days = days;
        },
        selectDate(day) {
            if (day.date) {
                const selectedMonth = this.selectableMonths[this.currentMonthIndex];
                this.selectedDate = {
                    year: selectedMonth.year,
                    month: selectedMonth.month,
                    day: day.date,
                };
                this.updateAvailableSlots();
                this.generateCalendar(selectedMonth.year, selectedMonth.month);
            }
        },
        updateAvailableSlots() {
            this.availableSlots = [];
            if (this.selectedDate.day % 2 === 0) {
                this.availableSlots = ["11:00", "13:00", "15:00", "16:00", "17:30"];
                this.selectedTime = this.availableSlots[0];
            } else {
                this.findNearestAvailableDate();
            }
        },
        findNearestAvailableDate() {
            const today = new Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day);
            let date = new Date(today);
            while (true) {
                date.setDate(date.getDate() + 1);
                if (date.getDate() % 2 === 0) break;
            }
            this.nearestAvailableDate = `${["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"][date.getDay()]}, ${date.getDate()} ${[
                "Января",
                "Февраля",
                "Марта",
                "Апреля",
                "Мая",
                "Июня",
                "Июля",
                "Августа",
                "Сентября",
                "Октября",
                "Ноября",
                "Декабря",
            ][date.getMonth()]}`;
        },
        selectNearestDate() {
            const nearestDate = new Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day);
            while (nearestDate.getDate() % 2 !== 0) {
                nearestDate.setDate(nearestDate.getDate() + 1);
            }
            this.selectedDate = {
                year: nearestDate.getFullYear(),
                month: nearestDate.getMonth(),
                day: nearestDate.getDate(),
            };
            this.updateAvailableSlots();
            this.generateCalendar(this.selectedDate.year, this.selectedDate.month);
        },
        selectTime(time) {
            this.selectedTime = time;
        },
        reschedule(){
            let rescheduleText = 'Запись перенесена на '+this.selectedDate.day+'.'+(this.selectedDate.month+1)+'.'+this.selectedDate.year+' '+this.selectedTime;
            console.log(rescheduleText);
            alert(rescheduleText);
        }
    },
    mounted() {
        this.updateCalendar();
        this.updateAvailableSlots();
    },
};
</script>
  
<style scoped>
    .calendar{
        margin-bottom: 16px;
    }

    .calendar__day.placeholder {
        color: var(--theme-text-color-gray);
        pointer-events: none;
    }
  
    .calendar__day.active {
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }
  
    .calendar__day.today {
        /* font-weight: bold; */
        /* border: 1px solid var(--theme-accent-color-blue); */
        background: #F8F8F8;
    }
    
    .calendar-month__arrow.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
</style>

<style scoped>
    .calendar-month{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 14px;
        margin-bottom: 26px;
    }
    .calendar__title-days{
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        height: 32px;
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: var(--theme-text-color-gray);
    }
    .calendar__title-day{
        width: 12%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .calendar__days{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

    }
    .calendar__day{
        width: 12%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 4px;
        border-radius: 12px;

        cursor: pointer;
    }

    .calendar__day.active{
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }

    .calendar__day.empty{
        color: var(--theme-text-color-gray);
    }

    .calendar-month__arrows{
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .calendar-month__arrow{
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
</style>

<style scoped>
    /* Стили для select */
    .calendar-month__select-wrapper {
        position: relative;
        display: inline-block;
        width: 200px; /* ширина select */
        }

    .calendar-month__select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 100%;
        padding: 8px 32px 8px 8px;
        font-family: Microsoft Sans Serif;
        font-size: 20px;
        font-weight: 400;
        line-height: 22.64px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: var(--theme-accent-color-blue);
        border: none;
        background-color: transparent;
        background-image: none;
        cursor: pointer;
    }

    /* Стили стрелочки */
    .calendar-month__arrow-select {
        position: absolute;
        right: 8px;
        top: 50%;
        width: 24px;
        height: 24px;
        transform: translateY(-50%);
        pointer-events: none; /* отключает клики на стрелке */
    }
</style>

<style scoped>
    .selected-day{
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .selected-day__time-division{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;
    }

    .selected-day__time-division__title{
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 600;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 18px;

    }

    .selected-day__time-list{
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        width: 100%;
    }

    .selected-day__time-item{
        width: 22%;
        height: 35px;
        border-radius: 16px;
        border: 1px solid rgba(0, 0, 0, 1);
        
        display: flex;
        justify-content: center;
        align-items: center;

        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 600;
        line-height: 19.24px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

    }

    .selected-day__time-item.active{
        background: var(--theme-accent-color-blue);
        border-color: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }

    .selected-day__reschedule-btn,
    .selected-day-empty__go-to-date-btn{
        width: 100%;
        height: 44px;
        border-radius: 12px;
        font-family: Microsoft Sans Serif;
        font-size: 15px;
        font-weight: 400;
        line-height: 16.98px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        display: flex;
        justify-content: center;
        align-items: center;

        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
        margin-bottom: 12px;

        cursor: pointer;
    }

    .selected-day__time-division.evening{
        margin-bottom: 60px;
        flex-grow: 1;
    }
</style>

<style scoped>
    .selected-day-empty{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .selected-day-empty__title{
        font-family: Microsoft Sans Serif;
        font-size: 17px;
        font-weight: 600;
        line-height: 19.24px;
        text-align: center;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        display: flex;
        justify-content: center;
        align-items: center;

        margin-bottom: 8px;
    }

    .selected-day-empty__content{
        font-family: Microsoft Sans Serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 14.71px;
        text-align: center;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;

        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--theme-text-color-gray);
        margin-bottom: 24px;
    }
</style>

<style scoped>
    .calendar-content{
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
    }
    .calendar-content .container{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .calendar-wrapper{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .selected-day{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-bottom: 84px;
    }
</style>

<style scoped>
    .fixed {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 20px;
        margin: 0 16px;
        width: calc(100% - 16px * 2);
        z-index: 100;
    }
    .selected-day__reschedule-btn-wrapper{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        z-index: 200;
        background: #EFEFF3;
        padding: 20px 16px;
        max-width: 400px;
    }
    .selected-day__reschedule-btn{
        margin-bottom: 0;
    }
</style>