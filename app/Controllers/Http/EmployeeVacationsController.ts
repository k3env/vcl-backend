import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import Employee from 'App/Models/Employee'
import Vacation from 'App/Models/Vacation'
import { DateTime } from 'luxon'

export default class EmployeeVacationsController {
  public async index({ request, response }: HttpContextContract) {
    const em = await Employee.find(request.param('employee_id'))
    response.send({ vacations: em?.vacations })
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      let employee = await Employee.find(request.param('employee_id'))
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
    if (model) {
      await model?.delete()
      response.send({ status: 'ok', id: request.param('id') })
    } else {
      response.notFound({ status: 'Not found', id: request.param('id') })
    }
  }
}
