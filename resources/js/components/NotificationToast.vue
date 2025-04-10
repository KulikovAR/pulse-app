<template>
    <transition name="toast">
        <div v-if="isVisible" :class="['notification-toast', type]">
            <img :src="getIconPath" alt="status icon" class="notification-toast__icon">
            <span class="notification-toast__text">{{ text }}</span>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'NotificationToast',
    props: {
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'success',
            validator: value => ['success', 'error', 'info'].includes(value)
        },
        duration: {
            type: Number,
            default: 3000
        }
    },
    data() {
        return {
            isVisible: true
        }
    },
    computed: {
        getIconPath() {
            const icons = {
                success: '/images/notify/success-check.svg',
                error: '/images/notify/error-cross.svg',
                info: '/images/notify/info-circle.svg'
            }
            return icons[this.type]
        }
    },
    mounted() {
        setTimeout(() => {
            this.isVisible = false
            setTimeout(() => {
                this.$destroy()
                this.$el.remove()
            }, 300)
        }, this.duration)
    }
}
</script>

<style scoped>
.notification-toast {
    position: fixed;
    bottom: 34px;
    left: 16px;
    right: 16px;
    transform: none;
    z-index: 9999;
    
    display: flex;
    align-items: center;
    padding: 16px 24px;
    gap: 10px;
    
    background: #0F0F0F;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Update transitions for bottom positioning */
.toast-enter-from, .toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.notification-toast__icon {
    width: 24px;
    height: 24px;
}

.notification-toast__text {
    color: #FFFFFF;
    font-family: Inter;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;

}

/* Transitions */
.toast-enter-active {
    transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}

.toast-leave-active {
    transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-100px);
}
</style>