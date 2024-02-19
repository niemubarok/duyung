import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ShiftsController {
  public async index({ response }: HttpContextContract) {
    const shift = await Database.query() // 👈 gives an instance of select query builder
      .from("shift")
      .select("*");
    response.status(200).json(shift);
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
