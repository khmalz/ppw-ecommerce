import type { HttpContext } from '@adonisjs/core/http'
import CartService from '#services/cart_service'

export default class CartController {
  public async index({ view, session }: HttpContext) {
    const cartService = new CartService(session)
    const cart = await cartService.getDetails()
    const { totalPrice } = await cartService.getTotals()

    return view.render('pages/carts', { cart, totalPrice })
  }

  public async store({ request, response, session }: HttpContext) {
    const { productId } = request.only(['productId'])
    if (!productId) {
      return response.badRequest({ message: 'Product ID is required' })
    }
    const cartService = new CartService(session)
    cartService.add(Number(productId))
    const { cartCount } = await cartService.getTotals()

    return response.json({ cartCount })
  }

  public async update({ params, request, response, session }: HttpContext) {
    const { quantity } = request.only(['quantity'])
    if (quantity === undefined || Number(quantity) < 0) {
      return response.badRequest({ message: 'Invalid quantity' })
    }
    const cartService = new CartService(session)
    if (Number(quantity) === 0) {
      cartService.remove(Number(params.productId))
    } else {
      cartService.update(Number(params.productId), Number(quantity))
    }
    const { cartCount, totalPrice } = await cartService.getTotals()

    return response.json({ cartCount, totalPrice })
  }

  public async destroy({ params, response, session }: HttpContext) {
    const cartService = new CartService(session)
    if (params.productId) {
      cartService.remove(Number(params.productId))
    } else {
      cartService.clear()
    }
    const { cartCount, totalPrice } = await cartService.getTotals()

    return response.json({ cartCount, totalPrice })
  }
}
