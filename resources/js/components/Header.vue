<template>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <router-link :to="{ name:'main' }" class="header-content__logo">
                    <img class="header-content__logo-img" src="/images/logo.svg" alt="">
                </router-link>
                <div class="header-content__title">
                    Pulse App
                </div>
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
        padding-top: 20px;
        margin-bottom: 12px;
    }
    .header-content{
        display: flex;
        align-items: center;
    }
    .header-content__logo,
    .header-content__logo-img{
        display: block;
        width: 36px;
        height: 36px;
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

    }
</style>