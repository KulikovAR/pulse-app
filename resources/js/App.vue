<template>
    <router-view />
</template>
  
<script>
export default {
    name: 'App',
    watch: {
        '$route'(to) {
            const telegram = window.Telegram.WebApp;
            
            // Show Back button on all pages except main
            if (to.name === 'main') {
                telegram.BackButton.hide();
                telegram.ClosingConfirmation = true;
            } else {
                telegram.ClosingConfirmation = false;
                telegram.BackButton.show();
            }
        }
    },
    mounted() {
        const telegram = window.Telegram.WebApp;
        telegram.ready();

        // Initial state based on current route
        if (this.$route.name === 'main') {
            telegram.BackButton.hide();
            telegram.ClosingConfirmation = true;
        } else {
            telegram.BackButton.show();
        }

        // Back button handler
        telegram.BackButton.onClick(() => {
            this.$router.go(-1);
        });
    }
};
</script>