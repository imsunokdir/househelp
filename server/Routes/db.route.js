const express = require("express");
const {
  schemaUpdate,
  serviceStatusUpdate,
  saveServiceField,
  testDb,
  addPasswordResetFields,
} = require("../Models/schema");

const dbRouter = express.Router();

dbRouter.post("/schema-update", schemaUpdate);
dbRouter.post("/status-update", serviceStatusUpdate);
dbRouter.post("/save-service-update", saveServiceField);
dbRouter.post("/add-password-reset-fields", addPasswordResetFields);
// dbRouter.post("/test-db", testDb);

module.exports = dbRouter;
