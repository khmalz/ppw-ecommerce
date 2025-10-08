import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async handle({ view }: HttpContext) {
    const products = await Product.query().orderBy('created_at', 'asc').limit(3)

    return view.render('pages/home', { products: products })
  }
}
