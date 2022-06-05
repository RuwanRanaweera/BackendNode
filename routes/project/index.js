const routes = require("express").Router();

const ProjectRoutes = require("../../controller/project/project.controller");

routes.post("/register", ProjectRoutes.registerProject);
routes.get("/getproject/:id", ProjectRoutes.getprojectbyId);
routes.get("/getAllproject", ProjectRoutes.getAllproject);
routes.delete("/deleteproject/:id", ProjectRoutes.deleteprojectbyId);
routes.put("/updateproject/:id", ProjectRoutes.updateprojectbyId);

module.exports = routes;
