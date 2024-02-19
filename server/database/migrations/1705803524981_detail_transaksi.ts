import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "detail_transaksi";

  public async up() {
    const hasTable = await this.schema.hasTable("detail_transaksi");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_detail_transaksi");
        table
          .string("no_transaksi")
          .unsigned()
          .references("no_transaksi")
          .inTable("transaksi_penjualan")
          .notNullable()
          .withKeyName("detail_transaksi_foreign");
        table
          .integer("id_wahana")
          .unsigned()
          .references("id_wahana")
          .inTable("master_wahana")
          .notNullable()
          .withKeyName("detail_wahana_foreign");
        table.integer("qty").notNullable();

        /**
         * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.timestamp("created_at", { useTz: true });
        table.timestamp("updated_at", { useTz: true });
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
