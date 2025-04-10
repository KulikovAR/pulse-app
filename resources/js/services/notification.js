import NotificationToast from '../components/NotificationToast.vue'
import { createApp } from 'vue'

const notification = {
    show(options) {
        const { text, type = 'success', duration = 3000 } = options
        
        // Create wrapper div
        const wrapper = document.createElement('div')
        document.body.appendChild(wrapper)
        
        // Create notification instance
        const notificationInstance = createApp(NotificationToast, {
            text,
            type,
            duration
        })
        
        notificationInstance.mount(wrapper)
    }
}

export default notification