<template>
    <router-view />
</template>
  
<script>
export default {
    name: 'App',
    mounted() {
        const telegram = window.Telegram.WebApp;
        telegram.ready();

        // Show both back and close buttons
        telegram.BackButton.show();
        telegram.ClosingConfirmation = true;

        // Back button handler
        telegram.BackButton.onClick(() => {
            this.$router.go(-1);
        });
    }
};
</script>