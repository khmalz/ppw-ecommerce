import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ view }: HttpContext) {
    const products = await Product.all()

    return view.render('pages/products', { products })
  }
}
