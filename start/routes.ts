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

router.on('/').render('pages/home').as('home')
router.on('/about').render('pages/about').as('about')
router.get('/products', [ProductsController, 'index']).as('products.index')
router.on('/checkout').render('pages/checkout').as('checkout')
