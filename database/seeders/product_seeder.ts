import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      { name: 'Gaming Laptop', price: 1000, imageUrl: 'https://picsum.photos/id/0/300/200' },
      { name: 'Camera', price: 350, imageUrl: 'https://picsum.photos/id/250/300/200' },
      { name: 'Alarm Clock', price: 10, imageUrl: 'https://picsum.photos/id/175/300/200' },
      { name: 'Cup', price: 5, imageUrl: 'https://picsum.photos/id/30/300/200' },
      { name: 'Joystick', price: 50, imageUrl: 'https://picsum.photos/id/96/300/200' },
      {
        name: 'Nike P-600',
        price: 105,
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/782405ec-b1f8-4a32-b293-46c5b4a4a016/NIKE+P-6000.png',
      },
      {
        name: 'White T-shirt',
        price: 25,
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/af21468b-0bca-47b7-91fd-8f21d199c16f/AS+W+NK+ONE+CLASSIC+DF+SS+TOP.png',
      },
      {
        name: 'Woman Sportswear',
        price: 50,
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e9b79684-d803-4459-b350-09a14cebff7d/AS+W+NSW+STREET+CARGO+SKIRT.png',
      },
      {
        name: 'Bag',
        price: 18,
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f3e37f32-cc20-4301-8a87-61e547a6a2df/NK+HERTGE+CRSSBY+-+ARTIST+AOP.png',
      },
      {
        name: 'Goalkeeper Gloves',
        price: 19,
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/3c812e6d-4f00-4e26-9431-11caf42474fc/NK+GK+MATCH+-+HO24.png',
      },
    ])
  }
}
