import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class AdminController {
  public async index({ response }: HttpContextContract) {
    response.send(await User.all())
  }
  public async store({ request, response }: HttpContextContract) {
    let u = await User.findBy('email', request.input('email'))
    if (u === null) {
      try {
        u = new User()
        u.email = request.input('email')
        u.password = request.input('password')
        await u.save()

        response.send({ status: 200, user: u, rawBody: request.body })
      } catch (e) {
        response.gone({ error: e })
      }
    } else {
      response.forbidden({ message: 'Already exists' })
    }
  }
  public async show({ request, response }: HttpContextContract) {
    let u = await User.find(request.param('id'))
    if (u) {
      response.send({ user: u })
    } else {
      response.notFound({ id: request.param('id') })
    }
  }
  public async update({ request, response }: HttpContextContract) {
    let u = await User.find(request.param('id'))
    u?.merge({
      password: request.input('password'),
      rememberMeToken: request.input('remember_me_token'),
      updatedAt: DateTime.now(),
    }).save()
    response.send({ user: u })
  }
  public async destroy({ request, response }: HttpContextContract) {
    let u = await User.find(request.param('id'))
    await u?.delete()
    response.send({ status: 'ok', id: request.param('id') })
  }
}
