import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import Wahana from "App/Models/Wahana";

export default class PaketTiket extends BaseModel {
  public static tableName = "paket_tiket";

  @column({ isPrimary: true })
  public idPaket: number;

  @column()
  public namaPaket: string;

  @column()
  public hargaPaket: number;

  @column()
  public diskon: number;

  @column()
  public status: boolean;

  @belongsTo(() => Wahana, {
    foreignKey: "id_wahana",
    localKey: "id_paket",
  })
  public wahana: BelongsTo<typeof Wahana>;
}
