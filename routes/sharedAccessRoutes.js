const Router = require("express").Router();

//importing middleware
const authMiddleware = require("../middleware/auth");

//importing controlelrs
const { grantAccess,
    updateAccess,
    revokeAccess,
    listAccesses, verifyAccess } = require("../controllers/sharedAccessController");

Router.post("/add", authMiddleware, grantAccess);
Router.get("/list", authMiddleware, listAccesses);
Router.post("/update", authMiddleware, updateAccess);
Router.post("/delete", authMiddleware, revokeAccess);
Router.post("/verify", authMiddleware, verifyAccess);


module.exports = Router;