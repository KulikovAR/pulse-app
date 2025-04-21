<template>
    <router-view />
</template>
  
<script>


export default {
    name: 'App',
    mounted() {
        const telegram = window.Telegram.WebApp;
        telegram.ready();

        // Включаем кнопку "Назад"
        telegram.BackButton.show();

        // Включаем стандартную кнопку закрытия
        telegram.enableClosingConfirmation();

        // Устанавливаем обработчик для нажатия на кнопку "Назад"
        telegram.BackButton.onClick(() => {
        // Ваша логика при нажатии кнопки "Назад"
            this.$router.go(-1);
        });
    }
};
</script>