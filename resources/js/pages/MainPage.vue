<template>
    <div class="main-page">
        <Header/>
        <!-- <Services/> -->
        <ReminderAccordion/>
    </div>
</template>

<script>
import Header from "../components/Header.vue"
import Services from "../components/Services.vue"
import ReminderAccordion from "../components/ReminderAccordion.vue";

export default {
    name: 'MainPage',
    components: {
        Header,
        Services,
        ReminderAccordion
    },
}
</script>

<style scoped>
    .main-page {
        display: flex;
        flex-direction: column; 
        min-height: 100vh; 
    }
</style>