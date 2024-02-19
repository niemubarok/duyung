import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import DetailPaketTiket from "App/Models/DetailPaketTiket";

export default class PaketTiketSeeder extends BaseSeeder {
  public async run() {
    // Data untuk dimasukkan ke dalam tabel detail_paket_tiket
    const dataPaketWahana = [
      // Paket Terusan
      { idPaket: 1, idWahana: [3, 5, 6, 8, 9, 10, 11, 12, 13] },
      // Paket Anak A
      { idPaket: 2, idWahana: [5, 12, 8] },
      // Paket Anak B
      { idPaket: 3, idWahana: [13, 6, 10, 11] },
    ];

    // Memasukkan data ke dalam tabel detail_paket_tiket menggunakan rawQuery
    for (const paket of dataPaketWahana) {
      for (const idWahana of paket.idWahana) {
        await Database.rawQuery(
          `INSERT INTO detail_paket_tiket (id_paket, id_wahana) VALUES (?, ?)`,
          [paket.idPaket, idWahana]
        );
      }
    }
  }
}
