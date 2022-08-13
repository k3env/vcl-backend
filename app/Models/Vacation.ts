import { DateTime } from 'luxon'
import {
  afterFetch,
  afterFind,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Employee from './Employee'

export default class Vacation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public start: DateTime

  @column()
  public length: number

  @belongsTo(() => Employee, {
    foreignKey: 'employee_id',
    serializeAs: 'employee',
  })
  public employee: BelongsTo<typeof Employee>

  @column()
  public employee_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFind()
  public static async afterFindHook(vacation: Vacation) {
    await vacation.load('employee')
  }

  @afterFetch()
  public static async afterFetchHook(vacations: Vacation[]) {
    await Promise.all(vacations.map(this.afterFindHook))
  }
}
