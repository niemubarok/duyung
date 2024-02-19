import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class WahanaController {
  public async index({ response }: HttpContextContract) {
    const wahana = await Database.query()
      .from("master_wahana")
      .innerJoin(
        "jenis_tiket",
        "master_wahana.id_jenis",
        "jenis_tiket.id_jenis"
      )
      .orderBy("master_wahana.id_wahana", "asc")
      .select("master_wahana.*", "jenis_tiket.nama_jenis as nama_jenis");
    response.status(200).json(wahana);
  }

  // public async paket({ response }: HttpContextContract) {
  //   const paketWithWahana = await Database.query()
  //     .from("paket_tiket")
  //     .innerJoin(
  //       "detail_paket_wahana",
  //       "paket_tiket.id",
  //       "detail_paket_wahana.id_paket"
  //     )
  //     .whereIn(
  //       "paket_tiket.id",
  //       Database.from("detail_paket_wahana").select("paket_id")
  //     )
  //     .groupBy("paket_tiket.id")
  //     .select(
  //       "paket_tiket.id as idPaket",
  //       "paket_tiket.nama_paket as namaPaket",
  //       "paket_tiket.harga_paket as hargaPaket",
  //       "paket_tiket.status"
  //     )
  //     .select(
  //       Database.raw("GROUP_CONCAT(detail_paket_wahana.id_wahana) as idWahana")
  //     );
  //   // .select(
  //   //   Database.raw(
  //   //     "(paket_tiket.harga_paket - IFNULL(paket_tiket.diskon, 0)) as diskon"
  //   //   )
  //   // );

  //   const result = paketWithWahana.map((paket) => ({
  //     ...paket,
  //     diskon: paket.hargaPaket - paket.diskon,
  //     idWahana: paket.idWahana.split(",").map(Number),
  //     status: paket.status === 1 ? true : false,
  //   }));

  //   response.status(200).json(result);
  // }

  public async create({ request, response }: HttpContextContract) {
    const req = request.body();

    const lastIdResult = await Database.rawQuery(
      "SELECT MAX(id_wahana) AS max_id FROM master_wahana"
    );
    const lastId = lastIdResult.rows[0]?.max_id;
    console.log("lastId", lastId);

    const newWahana = await Database.table("master_wahana")
      .returning("id_wahana")
      .insert({
        id_wahana: lastId + 1,
        nama: req.nama,
        id_jenis: req.jenis?.id,
        hari: req.hari,
        harga_tiket: req.harga_tiket,
        diskon: req.diskon,
        deskripsi: req.deskripsi,
        status: 1,
        created_at: new Date(),
        // updated_at:nu
      });

    if (newWahana) {
      const wahanaId = newWahana[0];
      response
        .status(201)
        .json({ message: "Wahana created successfully", id_wahana: wahanaId });
    } else {
      response.status(400).json({ message: "Failed to create wahana" });
    }
  }

  public async getJenisTiket({ response }: HttpContextContract) {
    const jenisTiket = await Database.rawQuery(`SELECT * FROM jenis_tiket`);

    if (jenisTiket.rows?.length) {
      response.status(200).json(jenisTiket.rows);
    }
  }

  public async edit({ request, response }: HttpContextContract) {
    const { id, column, value } = request.body();

    try {
      await Database.from("master_wahana")
        .where("id_wahana", id)
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

    try {
      const query = await Database.rawQuery(
        `DELETE FROM master_wahana WHERE id_wahana = ${id}`
      );

      response.status(201).json(query);
    } catch (error) {
      response.status(400).json({
        message: "Delete gagal",
        error: error.message,
      });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
