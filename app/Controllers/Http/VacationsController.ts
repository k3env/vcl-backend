import Employee from 'App/Models/Employee'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vacation from 'App/Models/Vacation'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/build/standalone'

export default class VacationsController {
  public async index({ request, response }: HttpContextContract) {
    response.send(await Vacation.query().where('employee_id', request.param('employee_id')))
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      let employee = await Employee.find(request.param('employee_id'))
      if (employee !== null) {
        let model = new Vacation()
        model.start = request.input('start')
        model.length = request.input('length')
        model.related('employee').associate(employee)

        model.save()

        response.send({ status: 200, vacation: model })
      } else {
        response.notFound({ message: 'Employee not found' })
      }
    } catch (e) {
      response.gone({ error: (e as Exception).message })
    }
  }
  public async show({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    if (model) {
      response.send({ vacation: model })
    } else {
      response.notFound({ id: request.param('id') })
    }
  }
  public async update({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    model
      ?.merge({
        start: request.input('start'),
        length: request.input('length'),
        updatedAt: DateTime.now(),
      })
      .save()
    response.send({ vacation: model })
  }
  public async destroy({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    await model?.delete()
    response.send({ status: 'ok', id: request.param('id') })
  }
}
