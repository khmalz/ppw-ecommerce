import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from '#validators/auth'
import User from '#models/user'

export default class RegisterController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
