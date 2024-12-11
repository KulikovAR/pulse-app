<template>
    <div class="calendar-content">
        <div class="container">
            <div class="calendar-wrapper">
                <div class="calendar-month">
                    <select class="calendar-month__select" name="" id="">
                        <option value="">Декабрь</option>
                        <option value="">Январь</option>
                        <option value="">Вефраль</option>
                    </select>

                    <div class="calendar-month__arrows">
                        <img class="calendar-month__arrow left" src="/images/btns/left-arrow.svg" alt="prev">
                        <img class="calendar-month__arrow right" src="/images/btns/right-arrow.svg" alt="next">
                    </div>
                </div>

                <div class="calendar">
                    <div class="calendar__title-days">
                        <div class="calendar__title-day">
                            ПН
                        </div>
                        <div class="calendar__title-day">
                            ВТ
                        </div>
                        <div class="calendar__title-day">
                            СР
                        </div>
                        <div class="calendar__title-day">
                            ЧТ
                        </div>
                        <div class="calendar__title-day">
                            ПТ
                        </div>
                        <div class="calendar__title-day">
                            СБ
                        </div>
                        <div class="calendar__title-day">
                            ВС
                        </div>
                    </div>
                    <div class="calendar__days">
                        <div class="calendar__day">

                        </div>
                        <div class="calendar__day">
                            
                        </div>
                        <div class="calendar__day">
                            
                        </div>
                        <div class="calendar__day">
                            
                        </div>
                        <div class="calendar__day">
                            
                        </div>
                        <div class="calendar__day">
                            
                        </div>
                        <div class="calendar__day">
                            1
                        </div>
                        <div class="calendar__day">
                            2
                        </div>
                        <div class="calendar__day">
                            3
                        </div>
                        <div class="calendar__day empty">
                            4
                        </div>
                        <div class="calendar__day">
                            5
                        </div>
                        <div class="calendar__day active">
                            6
                        </div>
                        <div class="calendar__day empty">
                            7
                        </div>
                        <div class="calendar__day">
                            8
                        </div>
                        <div class="calendar__day">
                            9
                        </div>
                        <div class="calendar__day">
                            10
                        </div>
                        <div class="calendar__day">
                            11
                        </div>
                        <div class="calendar__day">
                            12
                        </div>
                        <div class="calendar__day">
                            13
                        </div>
                        <div class="calendar__day">
                            14
                        </div>
                        <div class="calendar__day">
                            15
                        </div>
                        <div class="calendar__day">
                            16
                        </div>
                        <div class="calendar__day">
                            17
                        </div>
                        <div class="calendar__day">
                            18
                        </div>
                        <div class="calendar__day">
                            19
                        </div>
                        <div class="calendar__day">
                            20
                        </div>
                        <div class="calendar__day">
                            21
                        </div>
                        <div class="calendar__day">
                            22
                        </div>
                        <div class="calendar__day">
                            23
                        </div>
                        <div class="calendar__day">
                            24
                        </div>
                        <div class="calendar__day">
                            25
                        </div>
                        <div class="calendar__day">
                            26
                        </div>
                        <div class="calendar__day">
                            27
                        </div>
                        <div class="calendar__day">
                            28
                        </div>
                        <div class="calendar__day">
                            29
                        </div>
                        <div class="calendar__day">
                            30
                        </div>
                        <div class="calendar__day">
                            31
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CalendarContent'
}
</script>

<style scoped>
    .calendar-month{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .calendar__title-days{
        width: 100%;
        display: flex;
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
    }

    .calendar__day.active{
        background: var(--theme-accent-color-blue);
        color: var(--theme-bg-color-white);
    }

    .calendar__day.empty{
        color: var(--theme-text-color-gray);
    }
</style>