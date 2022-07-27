import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Employee from './Employee'

export default class Vacation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public start: DateTime

  @column()
  public length: number

  @belongsTo(() => Employee, { localKey: 'id', foreignKey: 'employee_id' })
  public employee: BelongsTo<typeof Employee>

  @column()
  public employee_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
