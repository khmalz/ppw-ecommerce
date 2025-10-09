import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const CartController = () => import('#controllers/api/cart_controller')

// API Routes
router
  .group(() => {
    router.post('', [CartController, 'store']).as('store')
    router.patch('/:productId', [CartController, 'update']).as('update')
    router.delete('/:productId?', [CartController, 'destroy']).as('destroy')
  })
  .prefix('/api/cart')
  .as('api.cart')
  .use(middleware.auth())
