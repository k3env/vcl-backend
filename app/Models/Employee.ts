import { DateTime } from 'luxon'
import { afterFind, BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Vacation from './Vacation'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public color: string

  @hasMany(() => Vacation, {
    foreignKey: 'employee_id',
    serializeAs: 'vacations',
    onQuery(query) {
      if (!query.isRelatedSubQuery) {
        query.preload('employee')
      }
    },
  })
  public vacations: HasMany<typeof Vacation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFind()
  public static async afterFindHook(employee: Employee) {
    await employee.load('vacations')
  }
}
