import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import Employee from 'App/Models/Employee'
import Vacation from 'App/Models/Vacation'
import { DateTime } from 'luxon'

import type {
  SingleResponse,
  ManyResponse,
  DeleteResponse,
  ErrorResponse,
} from '../../Helpers/ResponseTypes'

export default class EmployeeVacationsController {
  public async index({ request, response }: HttpContextContract) {
    const em = await Employee.find(request.param('employee_id'))
    if (em) {
      let res: ManyResponse<Vacation> = {
        data: em.vacations,
        message: 'OK',
        status: 200,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Employee with id ${request.param('employee_id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      const em = await Employee.find(request.param('employee_id'))
      if (em) {
        const model = await Vacation.create({
          start: request.input('start'),
          length: request.input('length'),
        })
        em.$pushRelated('vacations', [model])
        model.related('employee').associate(em)
        await model.save()
        let res: SingleResponse<Vacation> = {
          data: model,
          message: 'OK',
          status: 200,
        }
        response.send(res)
      } else {
        let eres: ErrorResponse = {
          data: null,
          message: `Employee with id ${request.param('employee_id')} not found`,
          status: 404,
        }
        response.notFound(eres)
      }
    } catch (e) {
      let eres: ErrorResponse = {
        data: null,
        message: (e as Exception).message,
        status: (e as Exception).status,
      }
      response.gone(eres)
    }
  }
  public async show({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    if (model) {
      let res: SingleResponse<Vacation> = {
        status: 200,
        message: 'OK',
        data: model,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Vacation with id ${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
  public async update({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    const e = await Employee.find(request.input('employee_id'))
    if (model && e) {
      await model
        .merge({
          start: request.input('start'),
          length: request.input('length'),
          updatedAt: DateTime.now(),
          employee_id: e.id,
        })
        .related('employee')
        .associate(e)
      e.$pushRelated('vacations', [model])
      await model.save()
      let res: SingleResponse<Vacation> = {
        data: model,
        message: 'OK',
        status: 200,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Vacation with id ${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
  public async destroy({ request, response }: HttpContextContract) {
    let model = await Vacation.find(request.param('id'))
    if (model) {
      await model?.delete()
      let res: DeleteResponse = {
        data: { id: request.param('id') },
        message: 'OK',
        status: 200,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Vacation #${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
}
