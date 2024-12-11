<template>
    <div class="reminder-page">
        <Header/>
        <Services/>
        <ReminderSinglePageItem 
            ref="ReminderSinglePageItem"
            @showCancelPopUp="showCancelPopUp"
        />
        <CancelAppointmentPopUp 
            ref="CancelAppointmentPopUp"
            @cancel="cancel"
        />
    </div>
</template>

<script>
import Header from "../components/Header.vue"
import Services from "../components/Services.vue"
import ReminderSinglePageItem from "../components/ReminderSinglePageItem.vue";
import CancelAppointmentPopUp from "../components/CancelAppointmentPopUp.vue";
export default {
    name: 'ReminderPage',
    components: {
        Header,
        Services,
        ReminderSinglePageItem,
        CancelAppointmentPopUp
    },
    methods: {
        showCancelPopUp(){
            this.$refs.CancelAppointmentPopUp.showPopUp();
        },
        cancel(){
            this.$refs.CancelAppointmentPopUp.closePopUp();

            this.$refs.ReminderSinglePageItem.cancel();
        }
    }
}
</script>

<style scoped>
    .reminder-page {
        display: flex;
        flex-direction: column; /* Устанавливаем вертикальное расположение */
        min-height: 100vh; /* Гарантируем высоту страницы на весь экран */
    }
</style>