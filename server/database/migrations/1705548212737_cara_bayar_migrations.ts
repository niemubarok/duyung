import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "cara_bayar";

  public async up() {
    const hasTable = await this.schema.hasTable("cara_bayar");

    if (!hasTable) {
      this.schema.createTable(this.tableName, (table) => {
        table.integer("id").primary().unique();
        table.string("cara_bayar").notNullable();
        table.string("deskripsi").nullable();

        table.timestamp("created_at", { useTz: true });
        table.timestamp("updated_at", { useTz: true });
      });
    }
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
