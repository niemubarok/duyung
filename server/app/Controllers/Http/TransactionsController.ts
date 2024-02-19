import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class TransactionsController {
  public async index({ request, response }: HttpContextContract) {
    const { startDate: startDateParam, endDate: endDateParam } = request.body();
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const startDate = startDateParam
      ? startDateParam
      : today.toISOString().split("T")[0].replace(/-/g, "/");
    const endDate = endDateParam
      ? endDateParam
      : today.toISOString().split("T")[0].replace(/-/g, "/");

    // return startDate;

    // const formatStartDate = startDate
    //   .toISOString()
    //   .split("T")[0]
    //   .replace(/-/g, "/");
    // const formatEndDate = endDate
    //   .toISOString()
    //   .split("T")[0]
    //   .replace(/-/g, "/");

    console.log(startDate, "-", endDate);

    const transaksi = await Database.rawQuery(
      `SELECT transaksi_penjualan.*, paket_tiket.nama_paket 
FROM transaksi_penjualan 
LEFT JOIN paket_tiket ON transaksi_penjualan.id_paket = paket_tiket.id_paket 
WHERE SUBSTRING(transaksi_penjualan.no_transaksi, 1, 10) BETWEEN ? AND ? ORDER BY transaksi_penjualan.created_at DESC
`,
      [startDate, endDate]
    );

    response.status(200).json(transaksi.rows);
  }

  public async create({ request, response }: HttpContextContract) {
    const data = request.body().data;
    // return data;
    // const datePrefix = "2024/01/20";
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const datePrefix = today.toISOString().split("T")[0].replace(/-/g, "/");
    // Retrieve the last transaction number for today and increment it
    const lastTransaction = await Database.query()
      .from("transaksi_penjualan")
      .whereRaw("no_transaksi LIKE ?", [`${datePrefix}/%`])
      .orderBy("no_transaksi", "desc")
      .first();

    let transactionNumber: number;

    if (lastTransaction) {
      const lastNumberStr = lastTransaction.no_transaksi.split("/").pop();
      const lastNumber = lastNumberStr ? parseInt(lastNumberStr) : NaN;

      if (!isNaN(lastNumber)) {
        transactionNumber = lastNumber + 1;
      } else {
        throw new Error("Failed to parse the last transaction number.");
      }
    } else {
      transactionNumber = 1;
    }

    const no_transaksi = `${datePrefix}/${String(transactionNumber).padStart(
      5,
      "0"
    )}`;
    // console.log(transactionNumber);

    // return no_transaksi;
    const {
      status,
      cara_bayar,
      petugas,
      diskon,
      totalAfterDiskon,
      total,
      idPaket,
    } = data;
    const transactionsData = data.transaksi.map(
      (item: { id_wahana: any; qty: any; total_bayar: any }) => ({
        no_transaksi,
        id_wahana: item.id_wahana,
        qty: item.qty,
        // id_cara_bayar: cara_bayar,
        // total: item.total_bayar,
        // status,
        // diskon,
        // total_bayar: totalAfterDiskon,
        // petugas,
        created_at: new Date(),
        // updated_at: new Date(),
      })
    );

    // const dataDetailTransaksi = data.transaksi.map(item=>{
    //   no_transaksi,

    // })
    console.log(idPaket);

    try {
      // return transactionsData;
      const currentDate = new Date();
      const [transaksi_penjualan] = await Database.table("transaksi_penjualan")
        .returning("id_transaksi")
        .insert({
          no_transaksi,
          cara_bayar,
          total,
          diskon,
          total_bayar: totalAfterDiskon,
          petugas,
          status,
          created_at: currentDate.toISOString(),
          id_paket: idPaket,
        });

      const detail_transaksi = await Database.table(
        "detail_transaksi"
      ).multiInsert(transactionsData);
      // Handle the successful insertion

      console.log(transaksi_penjualan);

      response.status(201).json({
        message: "Transaction created successfully",
        transaksi_penjualan,
        detail_transaksi,
        no_transaksi,
      });
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  }

  public async delete({ request, response }: HttpContextContract) {
    const { no_transaksi, petugas, keterangan } = request.body();
    console.log("onDelete", no_transaksi, petugas, keterangan);
    try {
      if (!no_transaksi) {
        response
          .status(400)
          .json({ message: "No transaction number provided" });
        return;
      }

      await Database.transaction(async (trx) => {
        // Delete detail transaksi first
        await trx
          .from("detail_transaksi")
          .where("no_transaksi", no_transaksi)
          .delete();

        // Then delete transaksi_penjualan
        const deletedRows = await trx
          .from("transaksi_penjualan")
          .where("no_transaksi", no_transaksi)
          .delete();

        if (Array.isArray(deletedRows) && deletedRows.length === 0) {
          response.status(404).json({ message: "Transaction not found" });
          return;
        }

        //log
        await trx.table("logs").insert({
          action: "DELETE",
          table: "transaksi_penjualan",
          deleted_rows: no_transaksi,
          petugas,
          keterangan,
          created_at: new Date(),
          updated_at: new Date(),
        });

        response.status(200).json({
          message: `Deleted ${deletedRows} rows from transaksi_penjualan and detail_transaksi`,
        });
      });
    } catch (error) {
      console.log(error);

      // If error occurs, the transaction is automatically rolled back
      response.status(500).json({ message: "Internal Server Error", error });
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const { no_transaksi } = request.body();

    const detaiTransaksi = await Database.rawQuery(
      `SELECT detail_transaksi.*, master_wahana.nama, master_wahana.id_jenis,jenis_tiket.nama_jenis as jenis 
   FROM detail_transaksi 
   INNER JOIN master_wahana ON detail_transaksi.id_wahana = master_wahana.id_wahana 
   INNER JOIN jenis_tiket ON master_wahana.id_jenis = jenis_tiket.id_jenis
   WHERE detail_transaksi.no_transaksi = '${no_transaksi}' `
    );
    // console.log(detaiTransaksi.rows);

    //  GROUP BY detail_transaksi.id_detail_transaksi, detail_transaksi.no_transaksi, detail_transaksi.id_wahana, detail_transaksi.qty, detail_transaksi.harga, master_wahana.nama`
    if (detaiTransaksi.rows?.length) {
      response.status(200).json(detaiTransaksi.rows);
    } else {
      response.abort({
        message: "gagal",
      });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
