import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "paket_tiket";

  public async up() {
    const hasTable = await this.schema.hasTable("paket_tiket");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_paket").primary();
        table.string("nama_paket", 50).notNullable();
        table.string("jenis_paket", 25).notNullable();
        table.decimal("harga_paket", 10, 2).notNullable();
        table.decimal("diskon", 10, 2).notNullable();
        table.string("deskripsi", 100).notNullable();
        table.boolean("status").notNullable();
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
