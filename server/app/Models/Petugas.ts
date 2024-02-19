import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
export default class Petugas extends BaseModel {
  public static table = "petugas";

  @column({ isPrimary: true })
  public idPetugas: number;

  @column()
  public namaLengkap: string;

  @column()
  public noHp: string;

  @column()
  public username: string;

  @column()
  public password: string;

  // Uncomment the following line if you decide to implement the remember me token feature
  // @column()
  // public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
