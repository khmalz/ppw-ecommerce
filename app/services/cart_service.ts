import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

type CartItem = {
  productId: number
  quantity: number
}

export default class CartService {
  constructor(private session: HttpContext['session']) {}

  /**
   * Mengambil semua item dari session keranjang
   */
  private getItems(): CartItem[] {
    return this.session.get('cart', [])
  }

  /**
   * Menyimpan array item ke session keranjang
   */
  private save(cart: CartItem[]): void {
    this.session.put('cart', cart)
  }

  /**
   * Menambah atau mengupdate kuantitas produk di keranjang
   */
  public add(productId: number): void {
    const cart = this.getItems()
    const itemIndex = cart.findIndex((item) => item.productId === productId)

    if (itemIndex > -1) {
      cart[itemIndex].quantity++
    } else {
      cart.push({ productId, quantity: 1 })
    }
    this.save(cart)
  }

  /**
   * Mengubah kuantitas produk spesifik
   */
  public update(productId: number, quantity: number): void {
    const cart = this.getItems()
    const itemIndex = cart.findIndex((item) => item.productId === productId)

    if (itemIndex > -1) {
      cart[itemIndex].quantity = quantity
      this.save(cart)
    }
  }

  /**
   * Menghapus produk spesifik dari keranjang
   */
  public remove(productId: number): void {
    let cart = this.getItems()
    cart = cart.filter((item) => item.productId !== productId)
    this.save(cart)
  }

  /**
   * Mengosongkan seluruh keranjang
   */
  public clear(): void {
    this.session.forget('cart')
  }

  /**
   * Menghitung total item dan total harga
   */
  public async getTotals() {
    const cart = this.getItems()
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
    let totalPrice = 0

    if (cart.length > 0) {
      const productIds = cart.map((item) => item.productId)
      const products = await Product.query().whereIn('id', productIds)

      totalPrice = products.reduce((total, product) => {
        const itemInCart = cart.find((item) => item.productId === product.id)!
        return total + product.price * itemInCart.quantity
      }, 0)
    }
    return { cartCount, totalPrice }
  }

  /**
   * Mengambil item keranjang lengkap dengan detail produk
   */
  public async getDetails() {
    const cart = this.getItems()
    let productsInCart: any[] = []

    if (cart.length > 0) {
      const productIds = cart.map((item) => item.productId)
      const products = await Product.query().whereIn('id', productIds)

      productsInCart = products.map((product) => {
        const itemInCart = cart.find((item) => item.productId === product.id)!
        const subtotal = product.price * itemInCart.quantity
        return { ...product.serialize(), quantity: itemInCart.quantity, subtotal }
      })
    }
    return productsInCart
  }
}
