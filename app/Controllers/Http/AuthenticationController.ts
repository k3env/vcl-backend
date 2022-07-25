import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthenticationController {
  public async create({ request, response }: HttpContextContract) {
    let u = await User.findBy('email', request.input('email'))
    if (u === null) {
      try {
        u = new User()
        u.email = request.body()['email']
        u.password = request.body()['password']
        await u.save()

        response.send({ status: 200, user: u, rawBody: request.body })
      } catch (e) {
        response.gone({ error: e })
      }
    } else {
      response.forbidden({ message: 'Already exists' })
    }
  }

  public async list({ auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (auth.isAuthenticated) {
      response.send({ status: 200, users: await User.all() })
    } else {
      response.unauthorized()
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const u = await User.findBy('email', request.input('email'))
    if (u === null) {
      response.notFound({ message: 'User with provided credentials not found' })
    } else {
      let token = await auth.login(u)
      response.send({ message: 'Authorized', data: token })
    }
  }
}
