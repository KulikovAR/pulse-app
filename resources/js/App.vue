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
        
        // Enable Close button
        telegram.MainButton.setParams({
            is_visible: true,
            color: '#FF0000'
        }).setText('✕');

        // Back button handler
        telegram.BackButton.onClick(() => {
            this.$router.go(-1);
        });

        // Close button handler
        telegram.MainButton.onClick(() => {
            telegram.close();
        });
    }
};
</script>