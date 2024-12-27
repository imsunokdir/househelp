const express = require("express");
const { schemaUpdate, serviceStatusUpdate } = require("../Models/schema");

const dbRouter = express.Router();

dbRouter.post("/schema-update", schemaUpdate);
dbRouter.post("/status-update", serviceStatusUpdate);

module.exports = dbRouter;
