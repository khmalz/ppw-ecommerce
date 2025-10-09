import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  /**
   * return HTML for api products search
   * @param {HttpContext} ctx
   * @returns {Promise<void>}
   */
  public async search({ request, view }: HttpContext) {
    const query = request.input('q', '')

    const products = await Product.query()
      .where('name', 'like', `%${query}%`)
      .orderBy('name', 'asc')

    return view.render('components/product_list', { products })
  }
}
