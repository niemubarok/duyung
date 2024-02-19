import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "transaksi_penjualan";

  public async up() {
    const hasTable = await this.schema.hasTable("transaksi_penjualan");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_transaksi").primary().unique();
        table.string("no_transaksi", 30).unique().notNullable();
        // table
        //   .integer("id_wahana")
        //   .unsigned()
        //   .notNullable()
        //   .references("id_wahana")
        //   .inTable("master_wahana");
        // table.integer("qty").notNullable();
        table.string("cara_bayar", 20).notNullable();
        table.integer("id_paket", 100);
        // .references("id")
        // .inTable("cara_bayar")
        // .withKeyName("transactions_cara_bayar_foreign"); // Add key name
        table.decimal("total", 10, 2).notNullable();
        table.decimal("diskon", 10, 2).notNullable();
        table.decimal("total_bayar", 10, 2).notNullable();
        table.string("petugas").unsigned().notNullable();
        // .references("id_petugas")
        // .inTable("petugas")
        // .withKeyName("transactions_petugas_foreign");
        table.boolean("status").notNullable();

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
