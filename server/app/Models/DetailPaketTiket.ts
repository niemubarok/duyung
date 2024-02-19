// import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import PaketTiket from "./Paket";
import Wahana from "./Wahana";

export default class DetailPaketTiket extends BaseModel {
  public static table = "detail_paket_tiket"; // Renamed to match the database table name

  @column({ isPrimary: true })
  public idDetail: number;

  @column()
  public idPaket: number;

  @column()
  public idWahana: number;

  @belongsTo(() => Wahana, {
    localKey: "id_wahana",
  })
  public wahana: BelongsTo<typeof Wahana>;

  @belongsTo(() => PaketTiket, {
    localKey: "id_paket",
  })
  public paketTiket: BelongsTo<typeof PaketTiket>;

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime;

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updatedAt: DateTime;
}
