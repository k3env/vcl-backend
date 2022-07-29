import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CorsHeader {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    response.header('Access-Control-Allow-Origin', '*')
    await next()
  }
}
