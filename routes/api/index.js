const router = require("express").Router();

const userRoutes = require("./user-routes");
const thoughtRoutes = require("./thoughts-routes");

// add prefix of "/XXXXX" to routes created in "XXXXX-routes.js"
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

module.exports = router;
