const Router = require("express").Router();

//importing controlelrs
const { signup, signin } = require("../controllers/userController");

Router.post("/signup", signup);
Router.post("/login", signin);


module.exports = Router;