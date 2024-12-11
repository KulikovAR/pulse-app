import { createWebHistory, createRouter } from 'vue-router'

// import MainPage from './pages/MainPage.vue'
import MainPage from './pages/MainPage.vue'
import ReminderPage from './pages/ReminderPage.vue'
import CalendarPage from './pages/CalendarPage.vue'


const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/reminder-page', name: 'reminder-page', component: ReminderPage },
  { path: '/calendar-page', name: 'calendar-page', component: CalendarPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
