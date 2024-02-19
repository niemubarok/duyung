import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

export default class extends BaseSeeder {
  public async run() {
    await Database.rawQuery(`
  INSERT INTO paket_tiket (id_paket, nama_paket, jenis_paket, harga_paket, diskon, deskripsi, status)
  VALUES
    (1, 'Paket Terusan', 'weekday', 75000, 35000, 'Deskripsi Paket Terusan', true),
    (2, 'Paket Anak A', 'weekday', 65000, 0, 'Deskripsi Paket Anak A', true),
    (3, 'Paket Anak B', 'weekend', 65000, 5000, 'Deskripsi Paket Anak B', true);
`);
  }
}
