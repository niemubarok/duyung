import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "petugas";

  public async up() {
    const hasTable = await this.schema.hasTable("petugas");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments("id_petugas").primary();
        table.string("nama_lengkap", 255).notNullable();
        table.string("no_hp", 20).notNullable();
        table.string("username", 50).notNullable().unique();
        table.string("password", 100).notNullable();
        table.boolean("status").notNullable().defaultTo(true);
        table.timestamp("created_at", { useTz: true });
        table.timestamp("updated_at", { useTz: true });
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
