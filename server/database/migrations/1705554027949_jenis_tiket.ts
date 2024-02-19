import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "jenis_tiket";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id_jenis").primary();
      table.string("nama_jenis").notNullable();
      table.text("deskripsi").nullable();
      table.boolean("status").notNullable().defaultTo(true);

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
