<template>
    <div class="calendar-page">
        <Header/>
        <CalendarContent/>
    </div>
</template>

<script>
import Header from "../components/Header.vue"
import CalendarContent from "../components/CalendarContent.vue"
export default {
    name: 'CalendarPage',
    components: {
        Header,
        CalendarContent
    }
}
</script>

<style scoped>
    .calendar-page {
        display: flex;
        flex-direction: column; 
        min-height: 100vh; 
    }
</style>