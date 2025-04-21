<template>
    <router-view />
</template>
  
<script>
export default {
    name: 'App',
    mounted() {
        const telegram = window.Telegram.WebApp;
        telegram.ready();

        // Enable Back button
        telegram.BackButton.show();
        
        // Add close button to header
        telegram.setHeaderButton({
            show: true,
            text: '✕'
        });

        // Back button handler
        telegram.BackButton.onClick(() => {
            this.$router.go(-1);
        });

        // Close button handler
        telegram.onEvent('headerButtonClicked', () => {
            telegram.close();
        });
    }
};
</script>