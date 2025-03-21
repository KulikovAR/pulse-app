import { createWebHistory, createRouter } from 'vue-router'

// import MainPage from './pages/MainPage.vue'
import MainPage from './pages/MainPage.vue'
import ReminderPage from './pages/ReminderPage.vue'
import CalendarPage from './pages/CalendarPage.vue'
import ConfirmPhonePage from './pages/ConfirmPhonePage.vue'


const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/reminder-page/:id', name: 'reminder-page', component: ReminderPage },
  { path: '/calendar-page', name: 'calendar-page', component: CalendarPage },
  { path: '/confirm-phone', name: 'confirm-phone', component: ConfirmPhonePage}
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
