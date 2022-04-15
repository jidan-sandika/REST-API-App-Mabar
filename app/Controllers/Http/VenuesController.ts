import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Field from 'App/Models/Field';
import Venue from 'App/Models/Venue'

export default class VenuesController {
  public async index({ response, request }: HttpContextContract) {
    if (request.qs().name) {
      let name = request.qs().name
      let venueHere = await Venue.findBy('name', name);
      return response.ok({message: 'Success get Venue', data: venueHere})
    }
    let venue = await Venue.all();
    return response.ok({message: 'Success get Venues', data: venue})
  }

  public async store({ response, request}: HttpContextContract) {
    try {
      // Validator
      const newVenueSchema = schema.create({
        name: schema.string(),
        address: schema.string(),
        phone: schema.string({}, [
            rules.mobile({
                locales: ['id-ID']
            })
        ])
    })
  
    console.log(request.body())
    const payload = await request.validate({schema: newVenueSchema})
    // return response.ok({data: payload})
    let newVenue = new Venue ();
    newVenue.name = request.input('name')
    newVenue.address = request.input('address')
    newVenue.phone = request.input('phone')
    await newVenue.save()
    return response.created({ message: 'Created!', data: payload})
      
    } catch (error) {
    return response.badRequest({ errors: error.messages, check: 'perhatikan penulisan nomor phone' })  
      
    }
  }

  public async show({ params, response }: HttpContextContract) {
    let field = await Field.query().where('venue_id', params.id)
    let venue = await Venue.query().where('id', params.id)

    const data = {venue: venue, fields: field}
    
    console.log(venue)
    return response.ok({message: 'success get Venue by id', data: data})
  }

  public async update({ request, response, params }: HttpContextContract) {
    let id = params.id
    let venue = await Venue.findOrFail(id)
    console.log(venue)
    venue.name = request.input('name')
    venue.address = request.input('address')
    venue.phone = request.input('phone')
    await venue.save()
    return response.ok({message: 'Updated!', data: venue})
  }

  public async destroy({ response, params }: HttpContextContract) {
    let venue = await Venue.findOrFail(params.id)
    
    await venue.delete()
    return response.ok({message: 'Deleted!', data: venue})
  }

  public async booking({ request, response }: HttpContextContract) {
    const bookingSchema = schema.create({
      name: schema.string(),
      venue: schema.string(),
      date: schema.date({
        format: 'dd-MM-yyyy HH:mm',
          },[
            rules.after('today'),
          ])
  })
  console.log(request.body())
  const payload = await request.validate({schema: bookingSchema})
  return response.ok({message: 'Pesanan berhasil', data: payload})
  }

  public async field ({ request, response, params }: HttpContextContract) {
    try {
      // Validator
      const newFieldSchema = schema.create({
        name: schema.string(),
        type: schema.enum(['futsal', 'mini soccer', 'basketball'] as const )
        //venue_id: schema.number()
    })
  
    //console.log(request.body())
    const payload = await request.validate({schema: newFieldSchema})
    // return response.ok({data: payload})
    let newField = new Field ();
    newField.name = request.input('name')
    newField.type = request.input('type')
    let id = params.id
    newField.venue_id = id
    await newField.save()
    return response.created({ message: 'Created!', data: payload})
  } catch (error) {
    return response.badRequest({ errors: error.messages, check: 'perhatikan penulisan type field' })  
      
    }
    
  }
}