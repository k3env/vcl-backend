import Employee from 'App/Models/Employee'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vacation from 'App/Models/Vacation'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/build/standalone'

export default class VacationsController {
  public async index({ response }: HttpContextContract) {
    response.send({ vacations: await Vacation.all() })
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      let employee = await Employee.find(request.input('employee_id'))
      if (employee !== null) {
        const model = await Vacation.create({
          start: request.input('start'),
          length: request.input('length'),
        })
        employee.$pushRelated('vacations', [model])
        model.related('employee').associate(employee)
        await model.save()

        response.send({ status: 200, vacation: model })
      } else {
        response.notFound({ message: 'Employee not found' })
      }
    } catch (e) {
      response.gone({ error: e as Exception })
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
    const e = await Employee.find(request.input('employee_id'))
    if (model !== null && e !== null) {
      model.load('employee')
      e.load('vacations')
      model
        ?.merge({
          start: request.input('start'),
          length: request.input('length'),
          updatedAt: DateTime.now(),
          employee_id: request.input('employee_id'),
        })
        .related('employee')
        .associate(e)
      e.$pushRelated('vacations', [model])
      model.save()
      response.send({ vacation: model })
    } else {
      response.notFound({ message: 'Vacation or Employee not found' })
    }
  }
  public async destroy({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    await model?.delete()
    response.send({ status: 'ok', id: request.param('id') })
  }
}
