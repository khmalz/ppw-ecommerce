/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ProductsController = () => import('#controllers/products_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')

router.on('/').render('pages/home').as('home')
router.on('/about').render('pages/about').as('about')
router.get('/products', [ProductsController, 'index']).as('products.index')
router.on('/checkout').render('pages/checkout').as('checkout')

router.get('/register', [RegisterController, 'index']).as('register.index')
router.post('/register', [RegisterController, 'store']).as('register.store')

router.get('/login', [LoginController, 'index']).as('login.index')
router.post('/login', [LoginController, 'store']).as('login.store')

router.post('/logout', [LoginController, 'destroy']).as('logout')
