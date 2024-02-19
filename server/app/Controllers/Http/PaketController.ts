import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class PaketController {
  public async index({ response }: HttpContextContract) {
    const paket = await Database.query().from("paket_tiket").select("*");
    console.log(paket);

    response.status(200).json(paket);
  }

  public async create({ request, response }: HttpContextContract) {
    const req = request.body().data;

    console.log(req);

    const trx = await Database.transaction();

    try {
      const paket = await trx
        .table("paket_tiket")
        .returning("id_paket")
        .insert({
          nama_paket: req.nama_paket,
          jenis_paket: req.jenis_paket,
          harga_paket: parseFloat(req.harga_paket),
          diskon: parseFloat(req.diskon),
          deskripsi: req.deskripsi,
          status: req.status?.toLowerCase() === "aktif" ? true : false,
        });

      const idPaket = paket[0].id_paket;
      const detailPaketData = req.id_wahana.map((idWahana: any) => ({
        id_paket: idPaket,
        id_wahana: idWahana,
      }));

      await Promise.all([
        trx.table("detail_paket_tiket").multiInsert(detailPaketData),
      ]);

      await trx.commit();
      response.status(201).json(paket);
    } catch (error) {
      console.log(error);

      await trx.rollback();
      response.status(500).json({ error: error.message });
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}
  public async edit({ request, response }: HttpContextContract) {
    const { id, column, value } = request.body();

    try {
      await Database.from("paket_tiket")
        .where("id_paket", id)
        .update({ [column]: value });

      response.status(201).json({
        message: "Update berhasil",
      });
    } catch (error) {
      console.log(error);

      response.status(400).json({
        message: "Update gagal",
        error: error.message,
      });
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.body();
    console.log("id", id);

    const trx = await Database.transaction();

    try {
      await trx.rawQuery(`DELETE FROM paket_tiket WHERE id_paket = ?`, [id]);
      await trx.rawQuery(`DELETE FROM detail_paket_tiket WHERE id_paket = ?`, [
        id,
      ]);

      await trx.commit();

      response.status(201).json({
        message: "Delete berhasil",
      });
    } catch (error) {
      console.log(error);

      await trx.rollback();

      response.status(500).json({
        message: "Delete gagal",
        error: error.message,
      });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
