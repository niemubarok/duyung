import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class InGateController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async barcode({ request, response }: HttpContextContract) {
    const { barcode } = request.body();
    console.log(barcode);

    try {
      const checkPetugas = await Database.rawQuery(
        `SELECT * FROM petugas WHERE nip = '${barcode}'`
      );

      console.log(checkPetugas.rows)
      if (checkPetugas.rows?.length) {
        response.status(200);
        return;
      }

      // const checkLogs = await Database.rawQuery(
      //   `SELECT * FROM ingate_logs WHERE no_transaksi = '${barcode}'`
      // );

      // console.log("checkLogs.rows?.length", checkLogs.rows?.length);

      // if (checkLogs.rows?.length) {
      //   response.status(403);
      // } else {
        const transaksi = await Database.rawQuery(
          `SELECT no_transaksi FROM transaksi_penjualan 
         WHERE no_transaksi = '${barcode}' `
        );
        console.log(transaksi.rows);

        //  GROUP BY detail_transaksi.id_detail_transaksi, detail_transaksi.no_transaksi, detail_transaksi.id_wahana, detail_transaksi.qty, detail_transaksi.harga, master_wahana.nama`
        if (transaksi.rows?.length > 0 ) {
          const storeLogs = await Database.rawQuery(
            `INSERT INTO ingate_logs (no_transaksi, created_at) VALUES ('${
              transaksi.rows[0].no_transaksi
            }','${new Date().toISOString()}')`
          );
          if (storeLogs) {
            response.status(200);
          }
        } else {
          response.status(403);
        }
      // }
    } catch (error) {
      console.log(error);
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
