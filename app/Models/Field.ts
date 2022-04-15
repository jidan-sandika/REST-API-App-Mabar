import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Venue from 'App/Models/Venue'

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public name: string
  
  @column()
  public type: string

  @column()
  public venue_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo( () => Venue )
  public owner: BelongsTo < typeof Venue>
}
