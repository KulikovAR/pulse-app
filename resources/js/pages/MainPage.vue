<template>
    <div class="main-page">
        <Header/>
        <Services/>
        <ReminderAccordion/>
        
        <!-- Error display -->
        <div v-if="authError" class="error-message">
            <h3>Ошибка авторизации:</h3>
            <pre>{{ authError }}</pre>
        </div>
    </div>
</template>

<script>
import Header from "../components/Header.vue"
import Services from "../components/Services.vue"
import ReminderAccordion from "../components/ReminderAccordion.vue";
import { telegramAuth } from "../services/auth.js";

export default {
    name: 'MainPage',
    components: {
        Header,
        Services,
        ReminderAccordion
    },
    data() {
        return {
            authError: null
        }
    },
    async created() {
        try {
            await telegramAuth.login();
        } catch (error) {
            this.authError = error.message;
        }
    }
}
</script>

<style scoped>
.error-message {
    padding: 15px;
    margin: 20px;
    background: #ffebee;
    border: 1px solid #ffcdd2;
    border-radius: 4px;
    color: #b71c1c;
}

.error-message pre {
    white-space: pre-wrap;
    word-break: break-word;
}

    .main-page {
        display: flex;
        flex-direction: column; 
        min-height: 100vh; 
    }
</style>