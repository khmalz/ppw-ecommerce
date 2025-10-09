import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const CartController = () => import('#controllers/api/cart_controller')
const ProductApiController = () => import('#controllers/api/products_controller')

// API Routes
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CartController, 'store']).as('store')
        router.patch('/:productId', [CartController, 'update']).as('update')
        router.delete('/:productId?', [CartController, 'destroy']).as('destroy')
      })
      .prefix('/cart')
      .as('cart')
      .use(middleware.auth())

    router.get('/products/search', [ProductApiController, 'search']).as('products.search')
  })
  .prefix('/api')
  .as('api')
