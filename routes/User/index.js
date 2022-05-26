const routes = require("express").Router();

const UserRoutes = require("../../controller/User/user.controller");

routes.post("/register", UserRoutes.registerUser);
// routes.post("/login", UserRoutes.loginUser);
routes.get("/getprofile/:id", UserRoutes.getuserbyId);    //getuserbyType
routes.get("/getUserDetailsByType/:type", UserRoutes.getuserbyType);
routes.put("/updateUser/:id", UserRoutes.updateUserbyId);
routes.put("/forget-password",UserRoutes.forgotPassword);
routes.put("/reset-password",UserRoutes.resetPassword);

//routes.purge("/forgot-password",forgotPassword);

module.exports = routes;

