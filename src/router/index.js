import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login'
import Auth from '@/components/Auth'
import ChatBox from '@/components/ChatBox'
import Profile from '@/components/Profile'
import Chat from '@/components/Chat'


const routes = [
	{
		path: '/',
		component: Login
	},
	{
		path: '/auth',
		component: Auth
	},
	{
		path: '/chat',
		component: Chat
	},
	{
		path: '/chat-box',
		component: ChatBox
	},
	{
		path: '/profile',
		component: Profile
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
