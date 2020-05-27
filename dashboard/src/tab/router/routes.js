import indexPage from './pages/index'
import loginPage from './pages/login'
import settingsPage from './pages/settings'
import updatedPage from './pages/updated'

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
  },
  {
    path: '/updated',
    component: updatedPage,
    name: 'updated'
  }
]
