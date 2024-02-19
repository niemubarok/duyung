import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { BelongsTo, belongsTo } from "@ioc:Adonis/Lucid/Orm";
import JenisTiket from "App/Models/JenisTiket";

export default class Wahana extends BaseModel {
  public static table = "master_wahana";

  @column({ isPrimary: true, columnName: "id_wahana" })
  public idWahana: number;

  @column()
  public nama: string;

  @belongsTo(() => JenisTiket, {
    localKey: "id_jenis_tiket",
    foreignKey: "id_jenis",
  })
  public idJenis: BelongsTo<typeof JenisTiket>;

  @column()
  public hari: string;

  @column()
  public hargaTiket: number;

  @column()
  public diskon: number;

  @column()
  public deskripsi: string | null;

  @column()
  public status: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
