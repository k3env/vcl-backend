import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Employee from 'App/Models/Employee'
import { DateTime } from 'luxon'

export default class EmployeesController {
  public async index({ response }: HttpContextContract) {
    response.send(await Employee.all())
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      let model = new Employee()
      model.name = request.input('name')
      model.color = request.input('color')
      await model.save()

      response.send({ status: 200, employee: model })
    } catch (e) {
      response.gone({ error: e })
    }
  }
  public async show({ request, response }: HttpContextContract) {
    let model = await Employee.find(request.param('id'))
    if (model) {
      response.send({ employee: model })
    } else {
      response.notFound({ id: request.param('id') })
    }
  }
  public async update({ request, response }: HttpContextContract) {
    let model = await Employee.find(request.param('id'))
    model
      ?.merge({
        name: request.input('name'),
        color: request.input('color'),
        updatedAt: DateTime.now(),
      })
      .save()
    response.send({ employee: model })
  }
  public async destroy({ request, response }: HttpContextContract) {
    let model = await Employee.find(request.param('id'))
    if (model) {
      await model?.delete()
      response.send({ status: 'ok', id: request.param('id') })
    } else {
      response.notFound({ status: 'Not found', id: request.param('id') })
    }
  }
}
