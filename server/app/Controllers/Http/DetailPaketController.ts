import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class DetailPaketController {
  public async index({ response }: HttpContextContract) {
    // const detail = await Database.from("detail_paket_tiket").select("*");
    // return detail;
    try {
      const detail = await Database.rawQuery(`
  SELECT
    p.id_paket AS "idPaket",
    p.nama_paket AS "namaPaket",
    p.harga_paket AS "hargaPaket",
    p.diskon AS "diskon",
    p.jenis_paket AS "jenisPaket",
    p.deskripsi AS "deskripsi",
    p.status AS "status",
    (SELECT STRING_AGG(dpt.id_wahana::text, ',') FROM detail_paket_tiket dpt WHERE dpt.id_paket = p.id_paket) AS "idWahana"
  FROM
    paket_tiket p
`);

      const result = detail.rows.map(
        (item: { idWahana: string; status: string }) => ({
          ...item,
          idWahana: item.idWahana ? item.idWahana.split(",").map(Number) : [],
          status: item.status,
        })
      );

      response.status(200).json(result);
    } catch (error) {
      console.log(error);

      response.status(500).json({
        message: "An error occurred during the query execution.",
        error: error.message,
      });
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { id_paket } = request.body();

    const detail = await Database.rawQuery(`
  SELECT
    p.id_paket AS idPaket,
    p.nama_paket AS namaPaket,
    p.harga_paket AS hargaPaket,
    p.diskon AS diskon,
    p.status AS status,
    (SELECT GROUP_CONCAT(dpt.id_wahana) FROM detail_paket_tiket dpt WHERE dpt.id_paket = p.id_paket) AS idWahana
  FROM
    paket_tiket p
  WHERE
    p.id_paket = ${id_paket}
`);

    const result = detail.map((item: { idWahana: string; status: string }) => ({
      ...item,
      idWahana: item.idWahana.split(",").map(Number),
      status: item.status === "true" ? true : false,
    }));

    response.status(200).json(result);
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
