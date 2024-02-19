import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

export default class extends BaseSeeder {
  public async run() {
    await Database.rawQuery(`INSERT INTO jenis_tiket (nama_jenis, deskripsi, status) VALUES 
('Tiket Masuk', '-', true),
('Tiket Wahana', '-', true)

`);
  }
}
