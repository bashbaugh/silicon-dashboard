import indexPage from './pages/index'
import loginPage from './pages/login'

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
  }
]
