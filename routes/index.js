const routes = require("express").Router();

const UserRoutes = require("./User");
const ProjectRoutes = require("./project");
const AdminRoutes = require("./admin");

routes.use("/user", UserRoutes);
routes.use("/project", ProjectRoutes);
routes.use("/admin", AdminRoutes);

module.exports = routes;
