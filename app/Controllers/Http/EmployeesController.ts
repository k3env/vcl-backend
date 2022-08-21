import { Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Employee from 'App/Models/Employee'
import { DateTime } from 'luxon'
import type {
  SingleResponse,
  ManyResponse,
  DeleteResponse,
  ErrorResponse,
} from '../../Helpers/ResponseTypes'

export default class EmployeesController {
  public async index({ response }: HttpContextContract) {
    let res: ManyResponse<Employee> = {
      status: 200,
      message: 'OK',
      data: await Employee.all(),
    }
    response.send(res)
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      let model = new Employee()
      model.name = request.input('name')
      model.color = request.input('color')
      await model.save()

      let res: SingleResponse<Employee> = {
        status: 200,
        message: 'OK',
        data: model,
      }
      response.send(res)
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
    let model = await Employee.find(request.param('id'))
    if (model) {
      let res: SingleResponse<Employee> = {
        status: 200,
        message: 'OK',
        data: model,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Employee with id ${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
  public async update({ request, response }: HttpContextContract) {
    let model = await Employee.find(request.param('id'))
    if (model) {
      await model
        ?.merge({
          name: request.input('name'),
          color: request.input('color'),
          updatedAt: DateTime.now(),
        })
        .save()
      let res: SingleResponse<Employee> = {
        status: 200,
        message: 'OK',
        data: model,
      }
      response.send(res)
    } else {
      let eres: ErrorResponse = {
        data: null,
        message: `Employee #${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
  public async destroy({ request, response }: HttpContextContract) {
    let model = await Employee.find(request.param('id'))
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
        message: `Employee #${request.param('id')} not found`,
        status: 404,
      }
      response.notFound(eres)
    }
  }
}
