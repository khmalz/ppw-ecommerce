import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class LoginController {
  async index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, session }: HttpContext) {
    console.log('Memulai login')

    const data = request.only(['email', 'password', 'users_data'])
    console.log(data)
    const payload = await loginValidator.validate(data)
    console.log(payload)

    let users = []
    try {
      users = JSON.parse(payload.users_data)
      if (!Array.isArray(users)) users = []
    } catch (error) {
      users = []
    }

    const user = users.find((u: any) => u.email === payload.email)

    if (!user) {
      session.flash('error', 'Email atau password salah.')
      return response.redirect().back()
    }

    const isPasswordValid = await hash.verify(user.password, payload.password)

    if (!isPasswordValid) {
      session.flash('error', 'Email atau password salah.')
      return response.redirect().back()
    }

    session.put('auth_user', { name: user.name, email: user.email })

    return response.redirect().toRoute('home')
  }

  async destroy({ response, session }: HttpContext) {
    session.forget('auth_user')
    return response.redirect().toRoute('home')
  }
}
