import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      response.redirect().toRoute('home')
    } catch (error) {
      session.flash('error', 'Email atau password yang Anda masukkan salah.')
      response.redirect().back()
    }
  }

  async destroy({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
