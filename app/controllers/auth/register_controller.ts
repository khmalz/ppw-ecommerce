import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { registerValidator } from '#validators/auth'

export default class RegisterController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'password', 'password_confirmation'])
    const payload = await registerValidator.validate(data)

    const hashedPassword = await hash.make(payload.password)

    const newUser = {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    }

    return response.json(newUser)
  }
}
