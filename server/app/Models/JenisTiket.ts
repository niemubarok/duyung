import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Wahana from "App/Models/Wahana";

export default class JenisTiket extends BaseModel {
  public static tableName = "jenis_tiket";

  @column({ isPrimary: true })
  public idJenis: number;

  @column()
  public namaJenis: string;

  @column()
  public deskripsi: string | null;

  @column()
  public status: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Wahana, {
    foreignKey: "id_jenis_tiket",
  })
  public wahana: HasMany<typeof Wahana>;
}
