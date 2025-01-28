const express = require("express");
const {
  schemaUpdate,
  serviceStatusUpdate,
  saveServiceField,
  testDb,
} = require("../Models/schema");

const dbRouter = express.Router();

dbRouter.post("/schema-update", schemaUpdate);
dbRouter.post("/status-update", serviceStatusUpdate);
dbRouter.post("/save-service-update", saveServiceField);
// dbRouter.post("/test-db", testDb);

module.exports = dbRouter;
