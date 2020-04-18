import indexPage from './pages/index'
import loginPage from './pages/login'
import settingsPage from './pages/settings'

export default [
  {
    path: '/',
    component: indexPage,
    name: 'index'
  },
  {
    path: '/login',
    component: loginPage,
    name: 'login'
  },
  {
    path: '/settings',
    component: settingsPage,
    name: 'settings'
  }
]
