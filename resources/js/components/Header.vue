<template>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <router-link :to="{ name:'main' }" class="header-content__logo">
                    <img class="header-content__logo-img" src="/images/header-logo.svg" alt="">
                </router-link>
                <!-- <div class="header-content__title">
                    Pulse App
                </div> -->
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style scoped>
    .header{
        padding-top: 24px;
        margin-bottom: 16px;
    }
    .header-content{
        display: flex;
        align-items: center;
    }
    .header-content__logo,
    .header-content__logo-img{
        display: block;
        width: 144px;
        height: 32px;
    }
    .header-content__logo{
        margin-right: 8px;
    }
    .header-content__title{
        font-family: Inter;
        font-size: 18px;
        font-weight: 500;
        line-height: 21.78px;
        letter-spacing: -0.18000000715255737px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        
        color: #6D6EFF;

        font-family: Inter;
        font-weight: 600;
        font-size: 18px;
        line-height: 100%;
        letter-spacing: -0.18px;
        vertical-align: middle;

    }
</style>