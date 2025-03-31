<template>
    <div class="confirm-phone-page">
        <div class="container">
            <div class="confirm-phone__content-wrapper">

                <div class="confirm-phone__content">
                    <img class="confirm-phone__content-logo" src="/images/logo.svg" alt="">
                    <div class="confirm-phone__content-info">
                        <div class="confirm-phone__content-info__title">
                            Добро пожаловать!
                        </div>

                        <div class="confirm-phone__content-info__text">
                            Поделитесь с ботом своим номером телефона, чтобы получать свои напоминания
                        </div>
                    </div>
                </div>

                <button 
                    class="confirm-phone__btn"
                    @click="handlePhoneRequest"
                    type="button"
                >
                    Поделиться номером
                </button>

            </div>
        </div>
    </div>
</template>

<script>
import { telegramAuth } from '../services/auth';

export default {
    name: 'ConfirmPhonePage',
    methods: {
        async handlePhoneRequest() {
            try {
                await telegramAuth.requestPhone();
                this.$router.replace('/');
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        }
    }
}
</script>

<style scoped>
    .confirm-phone-page{
        height: 100vh;
    }
    .confirm-phone-page .container{
        height: 100%;
    }
    .confirm-phone__content-wrapper{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 56px;
    }
    .confirm-phone__content{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        max-width: 257px;
        width: 100%;
    }
    .confirm-phone__content-logo{
        width: 72px;
        height: 72px;
    }
    .confirm-phone__content-info{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .confirm-phone__content-info__title{
        color: #000000;
        font-family: Inter;
        font-weight: 600;
        font-size: 18px;
        line-height: 100%;
        letter-spacing: -0.18px;
        text-align: center;
        vertical-align: middle;
        margin-bottom: 4px;
    }

    .confirm-phone__content-info__text{
        font-family: Inter;
        font-weight: 500;
        font-size: 16px;
        line-height: 100%;
        letter-spacing: 0px;
        text-align: center;
        vertical-align: middle;
        color: #707579;
        max-width: 221px;
        width: 100%;
    }

    .confirm-phone__btn{
        width: 100%;
        height: 44px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #3390EC;
        font-family: Microsoft Sans Serif;
        font-weight: 400;
        font-size: 15px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #FFFFFF;
    }
</style>