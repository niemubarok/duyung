import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "detail_paket_tiket";

  public async up() {
    const hasTable = await this.schema.hasTable("detail_paket_tiket");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_detail").primary();
        table
          .integer("id_paket")
          .unsigned()
          .references("id_paket")
          .inTable("paket_tiket")
          .onDelete("CASCADE")
          .withKeyName("detail_paket_foreign"); // Assuming we want to cascade delete

        table
          .integer("id_wahana")
          .unsigned()
          .references("id_wahana")
          .inTable("master_wahana")
          .onDelete("CASCADE")
          .withKeyName("master_wahana_foreign"); // Assuming we want to cascade delete
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
