import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up ()  {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.enu('type', ['futsal', 'mini soccer', 'basketball'],{
        
          useNative: true,
          enumName: 'type_status',
          existingType: false,
        
      })
      table.integer('venue_id').unsigned()
      table.foreign('venue_id').references('id').inTable('venues')
      //table.foreign("venue_id").references("id").inTable("venues")

      table.timestamps( true, true)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      //  table.timestamp('created_at', { useTz: true })
      //  table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
    // this.schema.raw('DROP TYPE IF EXISTS "type_status"')
    // this.schema.dropTable('fields')
  }
}
