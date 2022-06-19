const routes = require("express").Router();
const AdminRoutes = require("../../controller/admin/admin.controller");

routes.post("/login", AdminRoutes.loginAdmin);

module.exports = routes;