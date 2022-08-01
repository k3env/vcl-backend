import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CorsHeader {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    response.header('Access-Control-Allow-Credential', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
    await next()
  }
}
