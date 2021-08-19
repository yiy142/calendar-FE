import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MeetingInput from '../views/MeetingInput';
import MeetingResult from '../views/MeetingResult';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/newMeeting',
    name: 'NewMeeting',
    component: MeetingInput,
  },
  {
    path: '/result',
    name: 'Result',
    component: MeetingResult,
    props: true,
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
