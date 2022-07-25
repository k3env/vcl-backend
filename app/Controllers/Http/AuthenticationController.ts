import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthenticationController {
  public async create({ request, response }: HttpContextContract) {
    console.log()
    if (User.findBy('email', request.body()['email']) === null) {
      try {
        let u = new User()
        u.email = request.body()['email']
        u.password = request.body()['password']
        await u.save()
        console.log(u.$isPersisted)

        response.send({ status: 200, user: u, rawBody: request.body })
      } catch (e) {
        response.gone({ error: e })
      }
    } else {
      response.forbidden({ message: 'Already exists' })
    }
  }
  public async list({ response }: HttpContextContract) {
    response.send({ status: 200, users: await User.all() })
  }
}
