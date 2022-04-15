import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,  } from '@ioc:Adonis/Core/Validator'
import Field from 'App/Models/Field';
import Venue from 'App/Models/Venue';

export default class FieldsController {
  public async index({ response, request }: HttpContextContract) {
    if (request.qs().name) {
      let name = request.qs().name
      let fieldHere = await Field.findBy('name', name);
      return response.ok({message: 'Success get Field', data: fieldHere})
    }
    let field = await Field.all();
    return response.ok({message: 'Success get Fields', data: field})
  }

  public async store({ response, request }: HttpContextContract) {
    try {
      // Validator
      const newFieldSchema = schema.create({
        name: schema.string(),
        type: schema.enum(['futsal', 'mini soccer', 'basketball'] as const ),
        venue_id: schema.number()
    })
  
    console.log(request.body())
    const payload = await request.validate({schema: newFieldSchema})
    // return response.ok({data: payload})
    let newField = new Field ();
    newField.name = request.input('name')
    newField.type = request.input('type')
    newField.venue_id = request.input('venue_id')
    await newField.save()
    return response.created({ message: 'Created!', data: payload})
      
    } catch (error) {
    return response.badRequest({ errors: error.messages, check: 'perhatikan penulisan type field' })  
      
    }
  }

  public async show({ params, response }: HttpContextContract) {
    let field = await Field.findOrFail(params.id)
    console.log(field)
    return response.ok({message: 'success get Field by id', data: field})
  }

  public async update({ request, response, params }: HttpContextContract) {
    let id = params.id
    let field = await Field.findOrFail(id)
    console.log(field)
    field.name = request.input('name')
    field.type = request.input('type')
    field.venue_id = request.input('venue_id')
    await field.save()
    return response.ok({message: 'Updated!', data: field})
  }

  public async destroy({ response, params }: HttpContextContract) {
    let id = params.id
    let field = await Field.findOrFail(id)
    await field.delete()
    return response.ok({message: 'Deleted!', data: field})
  }

  // public async show_venue ({ params, response }: HttpContextContract) {
  //   const venue = await Field.query().preload('owner')
  //   return response.ok({message: 'success get Field by id', data: field})
  // }
}
