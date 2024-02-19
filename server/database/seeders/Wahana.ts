import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import Wahana from "App/Models/Wahana";

export default class extends BaseSeeder {
  public async run() {
    const rawQuery = `
    INSERT INTO master_wahana (id_wahana, nama, deskripsi, id_jenis, hari, harga_tiket, diskon, status)
    VALUES
      (1, 'Tiket Dewasa A', '-', 1, 'weekday', 20000, 0, true),
      (2, 'Tiket Dewasa B', '-', 1, 'weekday', 20000, 0, true),
      (3, 'Rainbow Slide 2x Main', '-', 1, 'weekday', 20000, 0, true),
      (5, 'Bombom Car', '-', 1, 'weekday', 10000, 0, true),
      (6, 'Kuda Kencana', '-', 1, 'weekday', 10000, 0, true),
      (8, 'Trampolin', '-', 1, 'weekday', 10000, 0, true),
      (9, 'Kora - Kora', '-', 1, 'weekday', 15000, 0, true),
      (10, 'Balon Air', '-', 1, 'weekday', 10000, 0, true),
      (11, 'Hand Boat', '-', 1, 'weekday', 10000, 0, true),
      (12, 'Istana Balon', '-', 1, 'weekday', 15000, 0, true),
      (13, 'Mandi Bola', '-', 1, 'weekday', 10000, 0, true),
      (14, 'Wisata Berkuda', '-', 1, 'weekday', 15000, 0, true),
      (16, 'Keranjang Sultan ', '-', 1, 'weekday', 20000, 0, true);
  `;

    await Database.rawQuery(rawQuery).exec();
  }
}
