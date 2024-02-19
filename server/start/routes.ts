/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return { hello: "world" };
});

Route.group(() => {
  Route.group(() => {
    Route.get("/", "WahanaController.index");
    Route.get("/paket", "WahanaController.paket");
    Route.post("/add", "WahanaController.create");
    Route.post("/edit", "WahanaController.edit");
    Route.post("/delete", "WahanaController.delete");
    Route.get("/jenis-tiket", "WahanaController.getJenisTiket");
    // Route.post("/add", "WahanaController.create");
  }).prefix("wahana");

  Route.group(() => {
    Route.get("/all", "UsersController.index");
    Route.post("/login", "UsersController.login");
    Route.post("/add", "UsersController.create");
    Route.post("/edit", "UsersController.edit");
    Route.post("/delete", "UsersController.delete");
  }).prefix("petugas");

  Route.group(() => {
    Route.get("/kunjungan", "ReportsController.kunjungan");
    Route.post("/pendapatan", "ReportsController.pendapatan");
    Route.post("/wahana", "ReportsController.wahana");
    Route.get("/fix", "ReportsController.fix");
  }).prefix("reports");

  Route.group(() => {
    Route.post("/create", "TransactionsController.create");
    Route.post("/all", "TransactionsController.index");
    Route.post("/delete", "TransactionsController.delete");
    Route.post("/detail", "TransactionsController.show");
  }).prefix("transaksi");

  Route.group(() => {
    Route.get("/all", "PaketController.index");
    Route.get("/detail", "DetailPaketController.index");
    Route.post("/create", "PaketController.create");
    Route.post("/edit", "PaketController.edit");
    Route.post("/delete", "PaketController.delete");
  }).prefix("paket");
  Route.group(() => {
    Route.post("/barcode", "InGateController.barcode");
  }).prefix("ingate");
}).prefix("api");
